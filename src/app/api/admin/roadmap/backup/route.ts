import {NextResponse} from "next/server";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {isLiveMode} from "@/lib/supabase/config";
import {makeRoadmapBackup} from "@/features/admin/roadmap-server-backup";
export const dynamic="force-dynamic";
export const runtime="nodejs";
const fail=(message:string,status:number)=>NextResponse.json({error:message},{status,headers:{"Cache-Control":"private, no-store"}});
export async function GET(){
 if(!isLiveMode())return fail("Không thể sao lưu Supabase trong Demo.",403);
 try{
  const supabase=await createSupabaseServerClient();
  const {data:{user},error:authError}=await supabase.auth.getUser();
  if(authError||!user)return fail("Cần đăng nhập tài khoản quản trị.",401);
  const {data:profile,error:roleError}=await supabase.from("profiles").select("role").eq("id",user.id).single();
  if(roleError||profile?.role!=="admin")return fail("Không có quyền quản trị.",403);
  const {data:doc,error}=await supabase.from("admin_roadmap")
   .select("items,version").eq("id","global-master-roadmap").maybeSingle();
  if(error||!doc)return fail("Không tải được Roadmap chính thức.",503);
  const events:unknown[]=[];
  const pageSize=250,maxEvents=2000;
  for(let offset=0;offset<=maxEvents;offset+=pageSize){
   const {data:chunk,error:historyError}=await supabase.from("admin_roadmap_events")
    .select("id,version,occurred_at,actor_id,changes").eq("document_id","global-master-roadmap")
    .order("id",{ascending:true}).range(offset,offset+pageSize-1);
   if(historyError||!chunk)return fail("Không tải được lịch sử sự kiện.",503);
   if(offset===maxEvents&&chunk.length>0)
    return fail("Lịch sử vượt giới hạn 2000 sự kiện; chưa tạo bản sao lưu.",409);
   events.push(...chunk);
   if(chunk.length<pageSize)break;
  }
  const payload=makeRoadmapBackup(doc.items,doc.version,events);
  return new NextResponse(JSON.stringify(payload,null,2),{headers:{
   "Content-Type":"application/json; charset=utf-8","Cache-Control":"private, no-store",
   "Content-Disposition":'attachment; filename="xcn-roadmap-server-backup.json"',
   "X-Content-Type-Options":"nosniff"
  }});
 }catch{return fail("Không thể tạo bản sao lưu Supabase.",503);}
}
