import type {Metadata} from "next";
import {PublicPendingPage} from "@/components/public-pending-page";

export const metadata:Metadata={
 title:"Tin tức & Tri thức",
 description:"Góc kiến thức Tin học, hướng dẫn và cập nhật sản phẩm đang được biên soạn. Chưa có bài viết chính thức được xuất bản tại đây."
};
export default function Page(){
 return <PublicPendingPage section="Tin tức & Tri thức" title="Kiến thức mới. Cách làm rõ ràng." description="Góc kiến thức Tin học, hướng dẫn và cập nhật sản phẩm đang được biên soạn. Chưa có bài viết chính thức được xuất bản tại đây."/>;
}
