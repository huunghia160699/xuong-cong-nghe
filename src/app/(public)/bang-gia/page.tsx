import type {Metadata} from "next";
import {PublicPendingPage} from "@/components/public-pending-page";

export const metadata:Metadata={
 title:"Bảng giá",
 description:"Chính sách giá và quyền sử dụng đang được xây dựng. Chúng tôi chưa công bố giá hoặc gói thanh toán khi chưa có thông tin chính thức."
};
export default function Page(){
 return <PublicPendingPage section="Bảng giá" title="Lựa chọn cách sử dụng phù hợp." description="Chính sách giá và quyền sử dụng đang được xây dựng. Chúng tôi chưa công bố giá hoặc gói thanh toán khi chưa có thông tin chính thức."/>;
}
