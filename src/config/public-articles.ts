/** Original editorial content owned by Xưởng Công Nghệ.
 * Articles are reviewed against current code. No third-party scraped or AI-fabricated news.
 * A future CMS must keep the published-only predicate and server-rendered escaping. */
export const NEWS_CATEGORIES=[
 "Tất cả","Hướng dẫn sử dụng","Tin học & ứng dụng",
 "Giáo dục số","AI trong dạy học","Cập nhật sản phẩm","STEM & dự án"
] as const;
export type NewsCategory=Exclude<(typeof NEWS_CATEGORIES)[number],"Tất cả">;
export type ArticleSection={
 heading:string; paragraphs:readonly string[]; steps?:readonly string[];
};
export type PublicArticle={
 slug:string;title:string;summary:string;category:NewsCategory;
 author:string;readingMinutes:number;
 publishedAt:string;updatedAt:string;status:"draft"|"published";
 tags:readonly string[];sections:readonly ArticleSection[];
};
const EDITORIAL_ARTICLES:readonly PublicArticle[]=[
 {
  slug:"gioi-thieu-he-sinh-thai-xuong-cong-nghe",
  title:"Xưởng Công Nghệ: Khám phá hệ sinh thái Học – Luyện – Ứng dụng",
  summary:"Tìm hiểu cách danh mục khóa học, Word Lab, trình chiếu và trắc nghiệm được tổ chức cùng các trạng thái phát triển minh bạch.",
  category:"Cập nhật sản phẩm",author:"Xưởng Công Nghệ",readingMinutes:4,
  publishedAt:"2026-10-31T08:00:00+07:00",updatedAt:"2026-10-31T08:00:00+07:00",
  status:"published",tags:["Hệ sinh thái","Khóa học","Word","Trình chiếu","Quiz"],
  sections:[
   {heading:"Từ khám phá đến thực hành",paragraphs:[
    "Xưởng Công Nghệ được phát triển như một nơi tập hợp nội dung học Tin học và những công cụ để người học tự thực hành. Cách tiếp cận Học – Luyện – Ứng dụng giúp bạn xác định điều cần hiểu, thử thao tác và dần tạo được kết quả cho chính mình.",
    "Trang chủ có danh mục hệ sinh thái để khách chưa đăng nhập xem toàn bộ nhóm công cụ. Mỗi mục có trạng thái Đã có, Đang phát triển hoặc Dự kiến. Danh mục không đồng nghĩa mọi tính năng đều sẵn sàng trên Production."
   ]},
   {heading:"Những không gian bạn có thể tìm hiểu",paragraphs:[
    "Khóa học tổ chức nội dung theo chủ đề. Thư viện trình chiếu cho phép xem danh sách bài giảng theo phần trước khi vào bài học. Word Lab là môi trường mô phỏng giao diện soạn thảo để luyện thao tác với văn bản; công cụ vẫn được cải tiến. Trắc nghiệm thuộc không gian học viên và có các bước làm bài, xem kết quả theo tài khoản.",
    "Người học có Student Hub; Admin là không gian quản trị dành cho người có quyền. Teacher Studio, Excel Lab và nhiều module khác nằm trong kế hoạch hoặc giai đoạn phát triển, không được giới thiệu như tính năng đã mở."
   ]},
   {heading:"Cách bắt đầu phù hợp",paragraphs:[
    "Bạn không cần tài khoản để xem danh mục, bài giới thiệu, thông tin sử dụng hoặc nội dung tin tức. Khi mở công cụ thực hành hoặc không gian theo tài khoản trên hệ thống Live, bạn cần đăng nhập và có vai trò hợp lệ."
   ],steps:[
    "Mở Trang chủ và dùng bộ lọc Hệ sinh thái để xác định nhóm công cụ.",
    "Chọn Tìm hiểu để xem trạng thái và mô tả, tránh nhầm tính năng dự kiến với tính năng sẵn có.",
    "Khi sẵn sàng thực hành, dùng liên kết đến công cụ; hệ thống sẽ yêu cầu đăng nhập nếu cần."
   ]},
   {heading:"Một nền tảng đang được phát triển theo giai đoạn",paragraphs:[
    "Dự án tiếp tục hoàn thiện trải nghiệm soạn thảo, nội dung, quyền truy cập và khả năng kết nối dữ liệu giữa các module. Thông tin chính thức về giá, quyền theo gói và công cụ dành cho tổ chức sẽ chỉ được công bố khi có chính sách được duyệt."
   ]}
  ]
 },
 {
  slug:"huong-dan-bat-dau-voi-word-lab",
  title:"Hướng dẫn bắt đầu với Word Lab: từ trang A4 đến định dạng văn bản",
  summary:"Các bước làm quen giao diện mô phỏng Word: mở công cụ, nhập chữ, dùng Ribbon và tự kiểm tra trình bày trên trang A4.",
  category:"Hướng dẫn sử dụng",author:"Xưởng Công Nghệ",readingMinutes:5,
  publishedAt:"2026-10-31T08:05:00+07:00",updatedAt:"2026-10-31T08:05:00+07:00",
  status:"published",tags:["Word Lab","Mô phỏng Word","Ribbon","Trang A4","Định dạng"],
  sections:[
   {heading:"Word Lab dùng để làm gì?",paragraphs:[
    "Word Lab là một trình mô phỏng soạn thảo trên trình duyệt của Xưởng Công Nghệ. Giao diện được tổ chức gần với môi trường dùng Ribbon, vùng trang A4 và những thao tác định dạng cơ bản để thực hành kỹ năng Tin học.",
    "Đây là công cụ đang tiếp tục được thử nghiệm, không phải Microsoft Word chính thức. Khả năng tương thích tài liệu hoặc xuất DOCX chuẩn chưa được bảo đảm."
   ]},
   {heading:"Các bước làm quen",paragraphs:[
    "Trước khi thực hành, bạn có thể xem mô tả tại trang Công cụ. Khi chọn mở Word Lab trên hệ thống Live, trang sẽ kiểm tra đăng nhập; sau khi xác thực bạn được đưa trở lại công cụ."
   ],steps:[
    "Từ trang Công cụ, tìm mục Mô phỏng Microsoft Word và chọn Mở công cụ.",
    "Trong vùng trang A4, nhấp vào phần nội dung để nhập một tiêu đề và vài dòng văn bản ngắn.",
    "Bôi đen một cụm từ và thử các lệnh định dạng chữ trên Ribbon như in đậm, nghiêng, gạch chân hoặc đổi cỡ chữ.",
    "Thử căn chỉnh và giãn cách đoạn; quan sát kết quả ngay trong vùng trang.",
    "Đọc lại văn bản sau mỗi thao tác để bảo đảm định dạng đúng đối tượng cần thay đổi."
   ]},
   {heading:"Bài thực hành ngắn",paragraphs:[
    "Hãy viết một đoạn giới thiệu lớp học khoảng năm câu. Đặt tiêu đề rõ ràng, dùng in đậm cho một từ khóa, thêm danh sách ngắn nếu cần và kiểm tra bố cục nhìn dễ đọc.",
    "Nếu thao tác nào chưa hoạt động đúng trên phiên bản thử nghiệm, hãy coi đó là giới hạn của công cụ đang phát triển; không nên dùng bản nháp mô phỏng thay cho tệp văn bản quan trọng."
   ]},
   {heading:"Cách học hiệu quả hơn",paragraphs:[
    "Thử từng lệnh một, sau đó tự trả lời: mình đã chọn đúng đoạn chưa, thao tác nào tạo ra thay đổi và liệu kết quả có giúp người đọc dễ hiểu hơn không? Mục tiêu là nắm nguyên lý soạn thảo, không phải ghi nhớ vị trí mọi biểu tượng."
   ]}
  ]
 },
 {
  slug:"huong-dan-su-dung-thu-vien-trinh-chieu",
  title:"Hướng dẫn sử dụng thư viện Trình chiếu theo phần",
  summary:"Cách tìm chủ đề Windows, Word và Excel cơ bản, mở bài trình chiếu và sử dụng phần ví dụ, bài tập, câu hỏi ôn tập.",
  category:"Hướng dẫn sử dụng",author:"Xưởng Công Nghệ",readingMinutes:4,
  publishedAt:"2026-10-31T08:10:00+07:00",updatedAt:"2026-10-31T08:10:00+07:00",
  status:"published",tags:["Trình chiếu","Bài giảng","Windows","Word","Excel"],
  sections:[
   {heading:"Thư viện được tổ chức như thế nào?",paragraphs:[
    "Thư viện Trình chiếu tập hợp các chủ đề Tin học theo nhóm Windows, Word cơ bản và Excel cơ bản. Từ trang danh mục công khai, bạn có thể đọc tên chủ đề, phần giới thiệu và số lượng slide trước khi chọn nội dung phù hợp.",
    "Mục tiêu của thư viện là hỗ trợ học theo phần kiến thức, ví dụ, hoạt động thực hành và câu hỏi ôn tập. Đây là trình phát bài học trực tiếp trên website; chưa có chức năng xuất tệp PowerPoint .pptx."
   ]},
   {heading:"Cách mở một bài giảng",paragraphs:[
    "Danh mục bài giảng có thể xem mà chưa đăng nhập. Khi chọn một chủ đề để mở trình chiếu trên hệ thống Live, bạn sẽ cần đăng nhập bằng tài khoản có quyền."
   ],steps:[
    "Mở Công cụ rồi chọn Thư viện trình chiếu.",
    "Đọc mô tả các nhóm Windows, Word cơ bản hoặc Excel cơ bản và chọn bài theo mục tiêu học tập.",
    "Nhấp vào tên chủ đề để mở trình phát; nếu được yêu cầu, hãy đăng nhập và tiếp tục.",
    "Khi bài học cho phép nhập tên lớp, điền tên phù hợp với hoạt động của mình.",
    "Theo dõi lần lượt các slide, dành thời gian cho ví dụ, câu hỏi hoặc nhiệm vụ thực hành trước khi chuyển sang nội dung tiếp theo."
   ]},
   {heading:"Gợi ý tổ chức một buổi học",paragraphs:[
    "Bạn có thể chia hoạt động thành ba phần: giới thiệu nhiệm vụ, quan sát ví dụ và thực hành lại trên máy. Khi gặp câu hỏi trong bài trình chiếu, hãy khuyến khích người học tự đưa ra dự đoán trước khi xem phần giải thích.",
    "Số slide hay tên bài có thể thay đổi khi học liệu được cập nhật. Kiểm tra nội dung thực tế trong thư viện trước buổi dạy, nhất là khi cần dùng với một lớp học cụ thể."
   ]},
   {heading:"Những giới hạn cần biết",paragraphs:[
    "Trình chiếu là công cụ nội bộ đang được phát triển liên tục; nó không thay thế hoàn toàn phần mềm trình chiếu độc lập. Các chức năng Teacher Studio, giao bài hoặc đồng bộ tiến độ với lớp học chưa được cam kết đã có trên Production."
   ]}
  ]
 }
];

export function getPublishedArticles(now=new Date()):PublicArticle[]{
 return EDITORIAL_ARTICLES.filter(article=>
  article.status==="published" && !!article.publishedAt &&
  Number.isFinite(Date.parse(article.publishedAt)) &&
  Date.parse(article.publishedAt)<=now.getTime()
 ).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
}
export function getPublishedArticle(slug:string):PublicArticle|undefined{
 return getPublishedArticles().find(article=>article.slug===slug);
}
export function resolveNewsCategory(value:string|null):typeof NEWS_CATEGORIES[number]{
 return NEWS_CATEGORIES.includes(value as typeof NEWS_CATEGORIES[number])
  ? value as typeof NEWS_CATEGORIES[number]:"Tất cả";
}
