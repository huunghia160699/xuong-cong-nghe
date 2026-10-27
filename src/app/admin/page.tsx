import {redirect} from "next/navigation";
import {AdminOverview} from "@/features/admin/components/admin-overview";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {isLiveMode} from "@/lib/supabase/config";
import {validateRoadmap} from "@/features/admin/roadmap-validation";

export default async function AdminDashboard(){
 if(!isLiveMode())return <AdminOverview live={false}/>;
 const supabase=await createSupabaseServerClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/dang-nhap?next=/admin");
 const [{count:users,error:userError},{count:courses,error:courseError},{count:attempts,error:attemptError},roadmapResult]
  =await Promise.all([
   supabase.from("profiles").select("id",{count:"exact",head:true}),
   supabase.from("courses").select("id",{count:"exact",head:true}),
   supabase.from("quiz_attempts").select("id",{count:"exact",head:true}),
   supabase.from("admin_roadmap").select("items").eq("id","global-master-roadmap").maybeSingle()
  ]);
 const roadmap=roadmapResult.error||!validateRoadmap(roadmapResult.data?.items)?null:roadmapResult.data.items;
 return <AdminOverview live roadmap={roadmap} stats={{
  users:userError?null:users,courses:courseError?null:courses,attempts:attemptError?null:attempts
 }}/>;
}
