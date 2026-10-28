import type {Metadata} from "next";
import {RoadmapBoard} from "@/features/admin/components/roadmap-board";
import {isLiveMode} from "@/lib/supabase/config";
export const metadata:Metadata={title:"Roadmap phát triển — Admin Xưởng Công Nghệ",
 description:"Quản lý tiến độ sản phẩm theo đường mốc dọc, checklist và nhật ký đã thêm/đã sửa."};
export default function AdminRoadmapPage(){
 return <div className="xcn-admin">
  <RoadmapBoard mode={isLiveMode()?"live":"demo"}/>
 </div>;
}
