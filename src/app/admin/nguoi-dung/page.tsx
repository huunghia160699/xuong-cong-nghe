import {isLiveMode} from "@/lib/supabase/config";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {AdminUsers} from "@/features/admin/components/admin-users";
import type {AdminProfile} from "@/features/admin/admin-controls";
export const dynamic="force-dynamic";
export default async function UsersPage(){
 if(!isLiveMode())return <AdminUsers rows={[]} live={false}/>;
 try{
  const supabase=await createSupabaseServerClient();
  const {data,error}=await supabase.from("profiles").select("id,display_name,role,created_at")
    .order("created_at",{ascending:false}).limit(500);
  if(error)throw Error(error.message);
  return <AdminUsers rows={(data??[]) as AdminProfile[]} live/>;
 }catch{return <AdminUsers rows={[]} live error="Không thể tải hồ sơ. Kiểm tra kết nối Supabase và RLS."/>;}
}
