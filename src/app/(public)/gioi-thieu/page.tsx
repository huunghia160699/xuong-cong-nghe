import type {Metadata} from "next";
import {PublicPendingPage} from "@/components/public-pending-page";

export const metadata:Metadata={
 title:"Giới thiệu",
 description:"Câu chuyện, sứ mệnh và kiến trúc Xưởng Công Nghệ đang được hoàn thiện. Trong lúc này, bạn có thể khám phá các công cụ đã có."
};
export default function Page(){
 return <PublicPendingPage section="Giới thiệu" title="Công nghệ dễ học hơn khi được thực hành." description="Câu chuyện, sứ mệnh và kiến trúc Xưởng Công Nghệ đang được hoàn thiện. Trong lúc này, bạn có thể khám phá các công cụ đã có."/>;
}
