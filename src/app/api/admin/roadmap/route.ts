import {NextResponse} from "next/server";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {isLiveMode} from "@/lib/supabase/config";
import {validateRoadmap,roadmapBytes,ROADMAP_MAX_BYTES} from "@/features/admin/roadmap-validation";

export const dynamic="force-dynamic";
const KEY="global-master-roadmap";
const fail=(message:string,status:number)=>NextResponse.json({error:message},{status,headers:{"Cache-Control":"no-store"}});
async function auth(){
 if(!isLiveMode())return {error:fail("Chế độ Demo lưu roadmap trong trình duyệt, không sử dụng API.",403)};
 const supabase=await createSupabaseServerClient();
 const {data:{user},error}=await supabase.auth.getUser();
 if(error||!user)return {error:fail("Vui lòng đăng nhập tài khoản quản trị.",401)};
 const {data:profile,error:roleError}=await supabase.from("profiles").select("role").eq("id",user.id).single();
 if(roleError||profile?.role!=="admin")return {error:fail("Tài khoản không có quyền quản trị.",403)};
 return {supabase,user};
}
const storageError=()=>fail("Chưa thể truy cập bảng Roadmap trong Supabase. Kiểm tra migration và chính sách RLS.",503);
export async function GET(){
 try{
  const a=await auth();if(a.error)return a.error;
  const {data,error}=await a.supabase!.from("admin_roadmap")
   .select("items,version").eq("id",KEY).maybeSingle();
  if(error)return storageError();
  return NextResponse.json({items:data?.items??[],version:data?.version??0},{headers:{"Cache-Control":"no-store"}});
 }catch{return fail("Không kết nối được dịch vụ Roadmap.",503);}
}
export async function PUT(request:Request){
 try{
  const a=await auth();if(a.error)return a.error;
  if(Number(request.headers.get("content-length")||0)>ROADMAP_MAX_BYTES)return fail("Roadmap vượt dung lượng cho phép.",413);
  const body=await request.json() as {items?:unknown;version?:unknown};
  if(!validateRoadmap(body.items)||roadmapBytes(body.items)>ROADMAP_MAX_BYTES)
    ||!Number.isInteger(body.version)||Number(body.version)<0)return fail("Dữ liệu roadmap không hợp lệ.",400);
  const version=Number(body.version);
  if(version===0){
   const {data,error}=await a.supabase!.from("admin_roadmap")
    .insert({id:KEY,items:body.items,version:1,updated_by:a.user!.id})
    .select("version").single();
   if(error){
    if(error.code==="23505")return fail("Roadmap đã được tạo ở phiên khác. Tải lại để tránh ghi đè.",409);
    return storageError();
   }
   return NextResponse.json({version:data.version},{headers:{"Cache-Control":"no-store"}});
  }
  const {data,error}=await a.supabase!.from("admin_roadmap")
   .update({items:body.items,version:version+1,updated_by:a.user!.id,updated_at:new Date().toISOString()})
   .eq("id",KEY).eq("version",version).select("version").maybeSingle();
  if(error)return storageError();
  if(!data)return fail("Dữ liệu đã thay đổi ở phiên khác. Tải lại trước khi ghi tiếp.",409);
  return NextResponse.json({version:data.version},{headers:{"Cache-Control":"no-store"}});
 }catch{return fail("Không thể lưu dữ liệu Roadmap.",503);}
}
