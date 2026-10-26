#!/usr/bin/env node
/**
 * Xưởng Công Nghệ — real JWT RLS verification.
 *
 * Default is STRICTLY read-only. The --write mode intentionally creates the
 * singleton Roadmap document and leaves it behind; run ONLY in an isolated
 * Supabase test project/branch, never against the production project.
 *
 * Credentials must be supplied via environment variables locally. Never send
 * passwords, access tokens or secret/service-role keys to GitHub or logs.
 */
import assert from "node:assert/strict";
import {createClient} from "@supabase/supabase-js";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

export const ROADMAP_ID="global-master-roadmap";
export const PRODUCTION_PROJECT_REF="bpxwpfmjoojrgqlfkqgz";

export function readRlsConfig(env,write=false){
 const required=[
  "RLS_SUPABASE_URL","RLS_SUPABASE_PUBLISHABLE_KEY",
  "RLS_ADMIN_EMAIL","RLS_ADMIN_PASSWORD",
  "RLS_STUDENT_EMAIL","RLS_STUDENT_PASSWORD"
 ];
 const missing=required.filter(key=>!env[key]?.trim());
 if(missing.length)throw new Error("Thiếu biến môi trường: "+missing.join(", "));
 const url=new URL(env.RLS_SUPABASE_URL);
 assert.equal(url.protocol,"https:","Supabase URL phải dùng HTTPS.");
 const key=env.RLS_SUPABASE_PUBLISHABLE_KEY;
 if(key.startsWith("sb_secret_"))throw new Error("Tuyệt đối không dùng secret key.");
 if(key.split(".").length===3){
  try{
   const payload=JSON.parse(Buffer.from(key.split(".")[1],"base64url").toString());
   if(payload.role==="service_role")throw new Error("Không dùng service_role key để kiểm thử RLS.");
  }catch(err){
   if(String(err).includes("service_role"))throw err;
  }
 }
 const adminEmail=env.RLS_ADMIN_EMAIL.trim();
 const studentEmail=env.RLS_STUDENT_EMAIL.trim();
 assert.notEqual(adminEmail.toLowerCase(),studentEmail.toLowerCase(),"Hai tài khoản kiểm thử phải khác nhau.");
 if(write){
  if(url.hostname===PRODUCTION_PROJECT_REF+".supabase.co")
   throw new Error("Cấm --write trên Supabase production. Dùng nhánh/test project riêng.");
  if(env.RLS_TEST_ISOLATED!=="YES"||env.RLS_WRITE_ACK!=="I_UNDERSTAND")
   throw new Error("--write chỉ chạy trên DB thử nghiệm với RLS_TEST_ISOLATED=YES và RLS_WRITE_ACK=I_UNDERSTAND.");
 }
 return {url:url.toString(),key,adminEmail,studentEmail,adminPassword:env.RLS_ADMIN_PASSWORD,
  studentPassword:env.RLS_STUDENT_PASSWORD};
}

const clientOptions={auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}};

export async function runRlsCheck({env=process.env,buildClient=createClient,write=false,logger=console.log}={}){
 const config=readRlsConfig(env,write);
 const admin=buildClient(config.url,config.key,clientOptions);
 const student=buildClient(config.url,config.key,clientOptions);
 const guest=buildClient(config.url,config.key,clientOptions);

 // Each Supabase client holds its OWN real Auth session (and sends its JWT).
 const login=async(client,email,password,role)=>{
  const {data,error}=await client.auth.signInWithPassword({email,password});
  if(error||!data?.session?.access_token)throw new Error("Đăng nhập "+role+" không thành công.");
  const result=await client.auth.getUser();
  if(result.error||!result.data?.user)throw new Error("Không thể xác thực JWT "+role+".");
  const user=result.data.user;
  if(!user.email_confirmed_at)throw new Error("Email kiểm thử chưa xác minh: "+role+".");
  const {data:profile,error:profileError}=await client.from("profiles")
   .select("role").eq("id",user.id).single();
  if(profileError||profile?.role!==role)throw new Error("Vai trò profiles.role không khớp "+role+".");
  return user;
 };
 const adminUser=await login(admin,config.adminEmail,config.adminPassword,"admin");
 const studentUser=await login(student,config.studentEmail,config.studentPassword,"student");
 assert.notEqual(adminUser.id,studentUser.id);

 // No unauthenticated client may SELECT this table; privileges deny it outright.
 const guestRead=await guest.from("admin_roadmap").select("id");
 if(!guestRead.error)throw new Error("LỖ HỔNG: anon đọc được bảng admin_roadmap.");
 logger("PASS: anon không được SELECT Roadmap.");

 const adminRead=await admin.from("admin_roadmap").select("id,items,version,updated_by");
 if(adminRead.error)throw new Error("Admin SELECT lỗi: "+adminRead.error.code);
 const adminRows=adminRead.data??[];
 if(adminRows.length>1||adminRows.some(row=>row.id!==ROADMAP_ID))
  throw new Error("Ràng buộc Roadmap tổng không đúng.");

 const studentRead=await student.from("admin_roadmap").select("id,items,version,updated_by");
 if(studentRead.error)throw new Error("Student SELECT phải được RLS lọc về 0 hàng: "+studentRead.error.code);
 if((studentRead.data??[]).length!==0)throw new Error("LỖ HỔNG: Student đọc được Roadmap.");
 logger("PASS: Admin có quyền SELECT, Student bị RLS lọc, phiên đăng nhập thực được xác minh.");

 if(!write){
  logger("READ-ONLY PASS: chưa thử INSERT/UPDATE/DELETE. Dùng nhánh Supabase thử nghiệm để chạy --write.");
  return {mode:"read-only",adminRows:adminRows.length,adminRole:"admin",studentRole:"student"};
 }

 // All tests below are intentionally MUTATING and restricted to isolated DBs.
 if(adminRows.length!==0)throw new Error("DB thử nghiệm đã có Roadmap. Không ghi đè dữ liệu.");

 const studentCreate=await student.from("admin_roadmap")
  .insert({id:ROADMAP_ID,items:[],version:1,updated_by:studentUser.id})
  .select("version");
 if(!studentCreate.error)throw new Error("LỖ HỔNG: Student có thể INSERT Roadmap.");
 const checkNoCreation=await admin.from("admin_roadmap").select("id");
 if(checkNoCreation.error||(checkNoCreation.data??[]).length!==0)
  throw new Error("Bản ghi bất ngờ xuất hiện sau khi Student bị từ chối.");

 const adminCreate=await admin.from("admin_roadmap")
  .insert({id:ROADMAP_ID,items:[],version:1,updated_by:adminUser.id})
  .select("version,updated_by").single();
 if(adminCreate.error||adminCreate.data?.version!==1||
   adminCreate.data?.updated_by!==adminUser.id)
  throw new Error("Admin INSERT bị từ chối hoặc danh tính người ghi sai.");

 const afterInsertStudent=await student.from("admin_roadmap").select("id");
 if(afterInsertStudent.error||(afterInsertStudent.data??[]).length!==0)
  throw new Error("LỖ HỔNG: Student đọc được Roadmap sau khi tạo.");

 // A filtered UPDATE returns zero rows; a student cannot touch the existing row.
 const studentUpdate=await student.from("admin_roadmap")
  .update({items:[],version:999,updated_by:studentUser.id})
  .eq("id",ROADMAP_ID).select("version");
 if(studentUpdate.error&&studentUpdate.error.code!=="42501")
  throw new Error("Student UPDATE trả lỗi khác mong đợi: "+studentUpdate.error.code);
 if((studentUpdate.data??[]).length!==0)
  throw new Error("LỖ HỔNG: Student cập nhật được Roadmap.");

 const adminUpdate=await admin.from("admin_roadmap")
  .update({items:[],version:2,updated_by:adminUser.id})
  .eq("id",ROADMAP_ID).eq("version",1).select("version,updated_by").single();
 if(adminUpdate.error||adminUpdate.data?.version!==2||
   adminUpdate.data?.updated_by!==adminUser.id)
  throw new Error("Admin UPDATE không được phép hoặc dữ liệu không khớp.");

 // WITH CHECK must refuse spoofed updated_by, including when executed by Admin.
 const spoofed=await admin.from("admin_roadmap")
  .update({updated_by:studentUser.id,version:3})
  .eq("id",ROADMAP_ID).select("version");
 if(!spoofed.error)throw new Error("LỖ HỔNG: Admin có thể mạo danh updated_by.");

 const finalRead=await admin.from("admin_roadmap").select("id,items,version,updated_by").single();
 if(finalRead.error||finalRead.data?.version!==2||
   finalRead.data?.updated_by!==adminUser.id||
   (finalRead.data?.items??[]).length!==0)
  throw new Error("Kiểm tra cuối không đạt: bảng Roadmap đã bị thay đổi ngoài dự kiến.");
 logger("WRITE PASS: Admin INSERT/UPDATE; Student INSERT/UPDATE bị chặn; chống mạo danh người ghi.");
 logger("LƯU Ý: Bảng thử nghiệm còn 1 bản Roadmap rỗng, version=2. Không chạy quy trình này trên production.");
 return {mode:"isolated-write",adminRows:1,version:2,adminRole:"admin",studentRole:"student"};
}

const isEntrypoint=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(isEntrypoint){
 runRlsCheck({write:process.argv.includes("--write")})
  .then(result=>{console.log("RLS verification complete:",result.mode);})
  .catch(err=>{console.error("RLS verification FAILED:",err.message);process.exitCode=1;});
}
