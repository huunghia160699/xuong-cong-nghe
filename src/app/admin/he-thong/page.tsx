import {AdminMonitor} from "@/features/admin/components/admin-monitor";
import {loadAdminStats} from "@/features/admin/admin-stats";
export const dynamic="force-dynamic";
export default async function AdminSystemPage(){
 try{const x=await loadAdminStats();return <AdminMonitor counts={x.values} error={x.error}/>;}
 catch{return <AdminMonitor error/>;}
}
