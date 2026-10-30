import type {Metadata} from "next";
import {PublicPendingPage} from "@/components/public-pending-page";

export const metadata:Metadata={
 title:"Liên hệ",
 description:"Các kênh liên hệ và biểu mẫu đang được hoàn thiện. Thông tin liên lạc sẽ chỉ được công bố sau khi được xác minh."
};
export default function Page(){
 return <PublicPendingPage section="Liên hệ" title="Kết nối với Xưởng Công Nghệ." description="Các kênh liên hệ và biểu mẫu đang được hoàn thiện. Thông tin liên lạc sẽ chỉ được công bố sau khi được xác minh."/>;
}
