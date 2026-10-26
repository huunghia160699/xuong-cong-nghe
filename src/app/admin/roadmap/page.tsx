import type {Metadata} from "next";
import Link from "next/link";
import {RoadmapBoard} from "@/features/admin/components/roadmap-board";
import {isLiveMode} from "@/lib/supabase/config";
export const metadata:Metadata={title:"Roadmap phát triển — Admin Xưởng Công Nghệ",
 description:"Quản lý tiến độ sản phẩm theo đường mốc dọc, checklist và nhật ký đã thêm/đã sửa."};
export default function AdminRoadmapPage(){
 return <div className="xcn-admin">
  <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
   <Link href="/admin" className="hover:text-blue-700">Admin</Link><span>/</span><span>Roadmap</span>
  </div>
  <RoadmapBoard mode={isLiveMode()?"live":"demo"}/>
 </div>;
}
