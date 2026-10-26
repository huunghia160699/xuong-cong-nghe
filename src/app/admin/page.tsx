import {redirect} from "next/navigation";
import {AdminOverview} from "@/features/admin/components/admin-overview";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {isLiveMode} from "@/lib/supabase/config";

export default async function AdminDashboard(){
 if(!isLiveMode())return <AdminOverview live={false}/>;
 const supabase=await createSupabaseServerClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/dang-nhap?next=/admin");
 const [{count:users,error:userError},{count:courses,error:courseError},{count:attempts,error:attemptError}]
  =await Promise.all([
   supabase.from("profiles").select("id",{count:"exact",head:true}),
   supabase.from("courses").select("id",{count:"exact",head:true}),
   supabase.from("quiz_attempts").select("id",{count:"exact",head:true})
  ]);
 return <AdminOverview live stats={{
  users:userError?null:users,courses:courseError?null:courses,attempts:attemptError?null:attempts
 }}/>;
}
