import {AdminMonitor} from "@/features/admin/components/admin-monitor";
import {loadAdminStats} from "@/features/admin/admin-stats";
import {isLiveMode} from "@/lib/supabase/config";
import {createSupabaseServerClient} from "@/lib/supabase/server";
export const dynamic="force-dynamic";

async function loadRoadmapHealth(){
 if(!isLiveMode())return {roadmapVersion:null,roadmapEvents:null};
 const supabase=await createSupabaseServerClient();
 const [doc,events]=await Promise.all([
  supabase.from("admin_roadmap").select("version")
   .eq("id","global-master-roadmap").maybeSingle(),
  supabase.from("admin_roadmap_events").select("id",{count:"exact",head:true})
 ]);
 return {
  roadmapVersion:doc.error?null:(doc.data?.version??null),
  roadmapEvents:events.error?null:events.count
 };
}
export default async function AdminSystemPage(){
 const [stats,health]=await Promise.allSettled([loadAdminStats(),loadRoadmapHealth()]);
 const x=stats.status==="fulfilled"?stats.value:{values:{},error:true};
 const y=health.status==="fulfilled"?health.value:{roadmapVersion:null,roadmapEvents:null};
 return <AdminMonitor counts={x.values} error={x.error}
  roadmapVersion={y.roadmapVersion} roadmapEvents={y.roadmapEvents}/>;
}
