/** Contact channels must be owner-verified before publishing.
 * Do not derive contact details from screenshots, domains or third-party websites.
 * The form is withheld until a real receiver, validation, spam protection and retention policy exist. */
export type ContactChannel={id:string;label:string;value:string;href:string;description:string};
export const VERIFIED_CONTACT_CHANNELS:readonly ContactChannel[]=[];
/** Only the project owner can activate this after verifying mailbox ownership and delivery.
 * Server-side variables are not public browser configuration. */
export function getVerifiedContactChannels():readonly ContactChannel[]{
 if(process.env.XCN_CONTACT_EMAIL_APPROVED!=="true")return VERIFIED_CONTACT_CHANNELS;
 const address=(process.env.XCN_CONTACT_EMAIL??"").trim();
 if(address.length>254||! /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(address))
  return VERIFIED_CONTACT_CHANNELS;
 return [{id:"email",label:"Email hỗ trợ chính thức",value:address,href:"mailto:"+address,
  description:"Kênh email đã được xác minh để nhận yêu cầu hỗ trợ và hợp tác."}];
}
export const CONTACT_TOPICS={
 support:{label:"Hỗ trợ kỹ thuật",heading:"Cần hỗ trợ về công cụ?",description:"Hãy mô tả công cụ, thao tác đang gặp khó khăn và thiết bị sử dụng khi kênh hỗ trợ chính thức được mở."},
 pricing:{label:"Tìm hiểu chính sách sử dụng",heading:"Tìm hiểu quyền sử dụng",description:"Chính sách giá và gói quyền đang hoàn thiện; chưa mở biểu mẫu đăng ký tư vấn hoặc thanh toán."},
 school:{label:"Triển khai lớp hoặc trường",heading:"Tìm hiểu triển khai cho tổ chức",description:"Teacher Studio và quản lý nhiều lớp đang phát triển; thông tin hợp tác sẽ được cập nhật sau khi xác minh đầu mối."},
 feedback:{label:"Góp ý sản phẩm",heading:"Chia sẻ ý tưởng hoàn thiện",description:"Các góp ý về trải nghiệm học tập và công cụ sẽ có kênh tiếp nhận khi hệ thống hỗ trợ được mở."},
 partnership:{label:"Hợp tác",heading:"Kết nối hợp tác",description:"Các đề xuất hợp tác sẽ được tiếp nhận khi kênh chính thức và chính sách bảo vệ dữ liệu được công bố."}
} as const;
export type ContactTopic=keyof typeof CONTACT_TOPICS;
export function getContactTopic(value:unknown):ContactTopic{
 return typeof value==="string" && Object.prototype.hasOwnProperty.call(CONTACT_TOPICS,value)
  ? value as ContactTopic:"support";
}
