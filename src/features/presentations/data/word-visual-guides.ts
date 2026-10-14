import type {PresentationLesson,PresentationSlide} from "../types";

type S = readonly [tab:string,command:string,title:string,detail:string,result?:string];
type Guide={after:string;scene:string;title:string;steps:S[];tip:string;heading?:string;paragraphs?:string[];bullets?:string[];table?:{headers:string[];rows:string[][]}};
const s=(tab:string,command:string,title:string,detail:string,result?:string):S=>[tab,command,title,detail,result];
const g=(after:string,title:string,scene:string,tip:string,steps:S[],heading?:string,paragraphs?:string[],table?:Guide["table"],bullets?:string[]):Guide=>({after,title,scene,tip,steps,heading,paragraphs,table,bullets});
const sample=["Học viên tham gia thực hành Microsoft Word và hoàn thành bài đúng yêu cầu.","Bài làm được lưu trong thư mục TIN_HOC / WORD để kiểm tra và nộp."];

const guides:Record<string,Guide[]>={
"word-lam-quen":[
 g("interface","Khám phá thanh Ribbon trong Word","editing","Mô phỏng vị trí tương đối của Word trên Windows. Giao diện thực tế khác nhau giữa Word 2021 và Microsoft 365.",[
  s("Home","Normal","Xác định vùng soạn thảo","Bên dưới dải Ribbon là trang giấy trắng; nháy vào trang để đặt con trỏ. Thanh thước ở đầu trang thể hiện phạm vi lề.", "Nhận biết trang giấy và vùng gõ nội dung."),
  s("Insert","Table","Chuyển sang Insert","Chọn thẻ Insert để quan sát nhóm Pages, Tables, Illustrations và Header & Footer. Đây là nơi thêm đối tượng, không phải thay đổi chữ đã có."),
  s("Layout","Margins","Chuyển sang Layout","Chọn Layout để tìm các lệnh Margins, Orientation và Size. Phân biệt lề trang với căn lề đoạn ở Home.")],"THÔNG BÁO",sample),
 g("new-document","Bắt đầu một tài liệu Word trống","open","Mô phỏng Backstage File. Trong Word thật có thể bấm Ctrl + N để tạo tệp mới nhanh hơn.",[
  s("File","New","Mở File → New","Bấm File để vào Backstage rồi chọn New. Với tài liệu trống, chọn Blank document.", "Một tài liệu mới mở ra, chưa đặt tên."),
  s("Home","Normal","Nhập tiêu đề","Nháy vào trang giấy và gõ THÔNG BÁO. Enter tạo một đoạn mới; tiếp tục nhập nội dung bên dưới."),
  s("File","Save As","Lưu lần đầu","Chọn File → Save As hoặc Ctrl + S, chọn thư mục, đặt tên Thong_bao_lop.docx rồi lưu.","Tệp .docx có tên rõ ràng.")]),
 g("open-document","Mở lại đúng tài liệu đã lưu","open","Nếu Word hiển thị Protected View, chỉ cho phép chỉnh sửa khi thực sự tin tưởng nguồn.",[
  s("File","Open","Mở trình chọn tệp","Chọn File → Open → Browse để tìm tệp trên máy hoặc OneDrive."),
  s("File","Open","Đi đến thư mục","Vào Documents / TIN_HOC / WORD. Kiểm tra tên và phần mở rộng để tránh mở nhầm tệp."),
  s("Home","Normal","Đọc nội dung","Sau khi mở, quan sát tiêu đề và đoạn văn; nếu cần sửa, nháy vào vùng nội dung rồi thực hiện.","Đúng tài liệu .docx, không phải tệp cùng tên khác.")]),
 g("cursor","Đặt vị trí con trỏ soạn thảo","editing","Dấu nháy dọc là con trỏ văn bản, khác biểu tượng chuột. Thực hành trên Word thật với Home/End.",[
  s("Home","Normal","Xác định chỗ cần sửa","Nháy chuột giữa câu thứ nhất; một vạch nháy cho biết nơi ký tự mới xuất hiện."),
  s("Home","Normal","Di chuyển trong câu","Dùng phím mũi tên, Home hoặc End để chuyển con trỏ mà không xóa dữ liệu."),
  s("Home","Normal","Chèn thêm nội dung","Gõ cụm từ mới ngay vị trí con trỏ, rồi đọc lại câu để chắc không mất khoảng trắng.","Vị trí nhập chính xác.")],"THÔNG BÁO",sample),
 g("type-vietnamese","Quy trình nhập văn bản tiếng Việt","editing","Ví dụ Telex chỉ dùng khi bộ gõ đã cài và bật đúng chế độ. Kiểm tra font Unicode để tránh lỗi hiển thị.",[
  s("Home","Font","Chọn phông hỗ trợ tiếng Việt","Dùng phông Unicode phổ biến như Arial, Calibri hoặc Times New Roman."),
  s("Home","Normal","Gõ từng câu đúng dấu","Bật bộ gõ tiếng Việt; gõ thử 'Trường học' và 'Thông báo' rồi kiểm tra chữ hoa, dấu và khoảng cách."),
  s("Review","Editor","Rà soát lại nội dung","Kiểm tra các từ gạch chân gợi ý, tên riêng, dấu câu và lỗi do bộ gõ; luôn đọc lại thủ công.","Hai câu đầy đủ dấu tiếng Việt.")],"THỰC HÀNH SOẠN THẢO",["Học viên ghi rõ họ tên và lớp trong văn bản tiếng Việt.","Văn bản phải có dấu chính xác, không viết hoa cả đoạn."]),
 g("paragraph","Phân biệt Enter và Shift + Enter","paragraph","Bật biểu tượng Show/Hide ¶ của Word thật để kiểm tra dấu đoạn; mô phỏng này chỉ hiển thị phần trình bày.",[
  s("Home","Normal","Nhấn Enter để sang đoạn","Đặt con trỏ cuối đoạn rồi Enter. Word tạo đoạn mới có thiết lập Paragraph riêng."),
  s("Home","Line Spacing","Điều chỉnh khoảng cách giữa đoạn","Dùng Paragraph Spacing thay vì chèn nhiều đoạn trống bằng Enter."),
  s("Home","Normal","Shift + Enter cho ngắt dòng","Trong cùng đoạn, Shift + Enter ngắt dòng nhưng không tạo paragraph mới.","Văn bản có đoạn rõ và không có dòng trống dư.")],"THÔNG BÁO",sample),
 g("selection","Chọn đúng phần chữ trước khi sửa","font","Không bôi đen cả văn bản nếu chỉ muốn làm đậm một từ; Ctrl + A thường chọn toàn nội dung.",[
  s("Home","Normal","Bôi đen phần cần đổi","Kéo chuột qua tiêu đề THÔNG BÁO hoặc giữ Shift và dùng phím mũi tên."),
  s("Home","Bold","Nhấn Bold cho phần đã chọn","Nút B ở Home làm đậm đúng vùng chọn; Ctrl + B là phím tắt tương ứng."),
  s("Home","Normal","Bỏ vùng chọn","Bấm ra ngoài để xem kết quả. Nếu áp nhầm, Ctrl + Z hoàn tác.","Chỉ tiêu đề được làm đậm.")],"THÔNG BÁO",sample),
 g("edit-keys","Sao chép và dán một đoạn Word","editing","Các thao tác demo chỉ mô tả quy trình, không sao chép dữ liệu thật trong website.",[
  s("Home","Copy","Sao chép phần đã chọn","Chọn câu cần sao chép → Ctrl + C hoặc Home → Copy."),
  s("Home","Paste","Đặt con trỏ và dán","Chuyển tới vị trí đích rồi Ctrl + V. Phần gốc vẫn còn."),
  s("Home","Normal","Kiểm tra định dạng khi dán","Nếu dán từ website, xem tùy chọn Paste Options/Keep Text Only để tránh mang định dạng lạ.","Nội dung mới đúng vị trí và định dạng.")]),
 g("save-saveas","Lưu nhanh và lưu thành bản mới","save","Ctrl + S có thể hiển thị hộp đặt tên/vị trí nếu tài liệu chưa từng lưu. AutoSave tùy vị trí lưu.",[
  s("File","Save","Save: cập nhật tệp hiện tại","Khi đã lưu tên, Ctrl + S ghi những thay đổi mới nhất vào cùng tài liệu."),
  s("File","Save As","Save As: tạo tên hoặc định dạng mới","Chọn File → Save As, chỉ định thư mục và tên khác để tránh ghi đè bản cần giữ."),
  s("File","Save As","Mở File Explorer xác nhận","Kiểm tra có tệp cũ và mới đúng phần mở rộng .docx.","Có bản gốc và bản mới để so sánh.")]),
 g("save-path","Chọn đường dẫn và tên tệp chính xác","save","Không dùng ký tự / \ : * ? \" < > | trong tên tệp Windows; dấu gạch dưới giúp tên dễ đọc.",[
  s("File","Save As","Xác định thư mục lưu","Browse → Documents → TIN_HOC → WORD; tạo thư mục nếu chưa có."),
  s("File","Save As","Đặt tên rõ nội dung","Gõ NguyenVanA_Thong_bao.docx hoặc tên theo quy định của giáo viên."),
  s("File","Save","Lưu và kiểm tra","Nhấn Save rồi kiểm tra thanh tiêu đề Word để nhận biết tài liệu đã có tên.","Đúng tệp trong đúng thư mục.")],"THÔNG BÁO",sample),
 g("example-word","Mô phỏng một trang thông báo Word","editing","Gõ nội dung trước, sau đó mới chọn và định dạng. Không căn giữa bằng cách chèn nhiều dấu cách.",[
  s("Home","Normal","Nhập tiêu đề","Gõ THÔNG BÁO ở dòng đầu, Enter để sang đoạn tiếp theo."),
  s("Home","Center","Căn giữa tiêu đề","Đặt con trỏ trong đoạn tiêu đề và chọn Center (Ctrl + E)."),
  s("Home","Bold","Nhấn mạnh tiêu đề","Chọn chữ tiêu đề, bấm Bold (Ctrl + B), kiểm tra khác biệt với phần nội dung.","Có tiêu đề riêng và hai đoạn dễ đọc.")],"THÔNG BÁO",["Về việc tổ chức buổi thực hành Microsoft Word.","Học viên chuẩn bị tài liệu và nộp bài đúng thời hạn."]),
 g("check-before-close","Kiểm tra an toàn trước khi đóng Word","save","Không chọn Don't Save nếu chưa lưu những thay đổi vừa thực hiện.",[
  s("File","Save","Lưu những nội dung cuối","Nhấn Ctrl + S, kiểm tra tài liệu không còn cảnh báo chưa lưu."),
  s("File","Open","Kiểm tra tệp từ File Explorer","Đóng tài liệu rồi mở lại chính tệp đó; nếu có đường dẫn gần đây, cần xác nhận đúng vị trí."),
  s("Home","Normal","So sánh nội dung sau mở","Đọc lại tiêu đề, một đoạn và tên tệp để chắc không mở nhầm bản cũ.","Tài liệu mở lại còn đầy đủ nội dung.")])
],
"word-dinh-dang":[
 g("font-style","Định dạng font và cỡ chữ ở Home","font","Định dạng font áp dụng cho phần được chọn; tiêu đề thường lớn hơn chữ nội dung, tuân thủ yêu cầu của đề.",[
  s("Home","Font","Chọn văn bản và phông","Bôi đen phần cần chỉnh rồi mở danh sách Font; ưu tiên phông Unicode dễ đọc."),
  s("Home","Font Size","Chọn cỡ chữ phù hợp","Chọn cỡ theo mẫu trình bày. Không đổi mọi chữ sang cùng một cỡ quá lớn."),
  s("Home","Bold","Làm nổi bật tiêu đề","Chỉ làm đậm tiêu đề hoặc từ khóa; xem lại khi bỏ bôi đen.","Phông và cỡ chữ có phân cấp rõ.")],"THÔNG BÁO",sample),
 g("emphasis","Khi nào dùng đậm, nghiêng và gạch chân?","font","Bold/Italic/Underline giúp nhấn mạnh, nhưng không được làm mất khả năng đọc của cả đoạn.",[
  s("Home","Bold","Bold cho nhãn quan trọng","Bôi đen một thuật ngữ rồi Ctrl + B để in đậm."),
  s("Home","Italic","Italic cho ghi chú hoặc thuật ngữ","Bấm Ctrl + I cho từ cần phân biệt."),
  s("Home","Underline","Underline khi mẫu có yêu cầu","Bấm Ctrl + U cho đoạn được chọn, sau đó xem lại sự nhất quán.","Mỗi kiểu chữ phục vụ một mục đích.")]),
 g("format-text","Ba bước định dạng một đoạn Word","font","Chọn đúng nội dung trước khi nhấn lệnh; không chọn toàn trang nếu chỉ chỉnh tiêu đề.",[
  s("Home","Font","Bôi đen đoạn đích","Chọn từ đầu tới cuối đoạn trước khi thao tác Ribbon."),
  s("Home","Font Size","Thay kích thước chữ","Chọn cỡ được yêu cầu, kiểm tra đoạn không vượt lề."),
  s("Home","Font Color","Kiểm tra màu và tương phản","Chỉ dùng màu chữ tối trên nền trắng cho văn bản chính.","Đoạn sau khi định dạng vẫn dễ đọc.")],"THÔNG BÁO",sample),
 g("align","So sánh căn trái, giữa và đều","paragraph","Ctrl + L (Left), Ctrl + E (Center), Ctrl + R (Right), Ctrl + J (Justify) là phím phổ biến trên Word Windows.",[
  s("Home","Align Left","Căn trái đoạn văn","Văn bản thường đọc thuận lợi nhất khi canh trái và giữ độ dài dòng hợp lý."),
  s("Home","Center","Căn giữa dòng tiêu đề","Chỉ đặt con trỏ ở đoạn tiêu đề rồi Ctrl + E."),
  s("Home","Justify","Căn đều khi phù hợp","Chọn đoạn thân bài rồi Justify (Ctrl + J), kiểm tra khoảng trắng giữa các từ.","Nội dung chính và tiêu đề dùng căn phù hợp.")],"THÔNG BÁO",sample),
 g("align-keys","Quan sát thay đổi khi căn lề bằng phím","paragraph","Đặt con trỏ trong đoạn trước khi nhấn phím; không phải lúc nào cũng cần bôi đen.",[
  s("Home","Align Left","Ctrl + L","Căn trái đoạn đang chứa con trỏ, giữ đầu dòng sát lề trái."),
  s("Home","Center","Ctrl + E","Căn giữa đoạn tiêu đề, không cần chèn dấu cách."),
  s("Home","Justify","Ctrl + J","Căn đều hai mép đoạn văn dài, sau đó đọc soát.","Biết lựa chọn 3 cách căn cơ bản.")]),
 g("spacing","Phân biệt giãn dòng với cách đoạn","paragraph","Dùng Paragraph → Before / After và Line Spacing; không chèn Enter rỗng thay cho giãn cách đoạn.",[
  s("Home","Line Spacing","Chọn đoạn có nhiều dòng","Chọn một đoạn có ít nhất hai dòng để nhìn rõ sự thay đổi khoảng cách dòng."),
  s("Home","Line Spacing","Chọn Line Spacing","Trong menu, chọn 1.0, 1.5 hoặc mức được yêu cầu."),
  s("Layout","Spacing","Thay Paragraph Spacing","Tăng After khi cần tách đoạn; kiểm tra không xuất hiện dòng trống giả.","Khoảng cách dòng và khoảng cách đoạn có chủ đích.")],"THÔNG BÁO",sample),
 g("indent","Thụt đầu dòng bằng công cụ, không dùng dấu cách","paragraph","Thước Ruler dùng điều khiển First Line và Left/Right Indent; khi cần chính xác hãy mở hộp thoại Paragraph.",[
  s("View","Ruler","Hiển thị thước Word","Chọn View → Ruler để quan sát các dấu thụt trên thước."),
  s("Layout","Indent","Điều chỉnh độ thụt của đoạn","Đặt Left/Right Indent hoặc mở Paragraph để chỉnh First Line."),
  s("Home","Normal","Đọc lại bố cục","Xem phần đầu đoạn có đồng nhất, không tạo khoảng trắng dài bằng Space.","Các đoạn có thụt đầu dòng thống nhất.")]),
 g("lists","Tạo danh sách Bullets và Numbering","lists","Nội dung có trình tự dùng Numbering; ý liệt kê ngang hàng dùng Bullets. Tránh tự gõ 1), 2), 3) cho danh sách dài.",[
  s("Home","Bullets","Chọn Bullets","Bôi đen ba dòng nội dung rồi bấm Bullets để thêm dấu đầu dòng tự động."),
  s("Home","Numbering","Chuyển sang Numbering","Chọn Numbering để Word quản lý thứ tự 1,2,3 nếu đó là quy trình."),
  s("Home","Normal","Chỉnh một mục","Nhấn Enter cuối mục để tạo mục kế; Enter ở mục trống thường kết thúc danh sách.","Danh sách có cấu trúc chỉnh sửa được.")],"CẦN CHUẨN BỊ",["Các tài liệu cần mang theo:"],undefined,["Máy tính có Word","Tài liệu thực hành","Thư mục nộp bài"]),
 g("sample-format","Từ văn bản thô đến thông báo hoàn chỉnh","styles","Nhập nội dung trước, sau đó áp dụng Styles; không chèn khoảng trắng để đẩy tiêu đề vào giữa.",[
  s("Home","Center","Tạo tiêu đề","Bôi đen dòng THÔNG BÁO rồi căn giữa."),
  s("Home","Heading 1","Áp Style cho đề mục","Dùng Heading 1 cho một đề mục chính, giúp quản lý cấu trúc."),
  s("Home","Line Spacing","Hoàn thiện đoạn","Đặt Line Spacing và Paragraph Spacing hợp lý trước khi lưu.","Bản Word dễ đọc, có phân cấp.")],"THÔNG BÁO",["Lớp học tổ chức buổi thực hành vào thứ Sáu.","Học viên cần mang tài liệu và nộp bài đúng thời hạn."]),
 g("styles","Heading 1 khác in đậm thủ công","styles","Heading không chỉ trang trí; nó tạo cấu trúc tài liệu và có thể dùng trong Navigation Pane / mục lục.",[
  s("Home","Normal","Giữ Normal cho thân bài","Các đoạn giải thích thông thường nên dùng Normal hoặc style nội dung tương ứng."),
  s("Home","Heading 1","Dùng Heading 1 cho đề mục","Bôi đen đề mục cấp một, áp Heading 1 từ nhóm Styles."),
  s("References","Table of Contents","Liên hệ đến mục lục","Khi văn bản có nhiều heading, References có thể tạo mục lục tự động.","Đề mục nhận diện rõ trong cấu trúc Word.")],"1. GIỚI THIỆU",["Đây là một phần của báo cáo. Tiêu đề dùng Heading 1 để xây dựng cấu trúc.","Nội dung bình thường dùng Normal giúp định dạng thống nhất."]),
 g("format-painter","Sao chép định dạng bằng Format Painter","font","Format Painter sao chép định dạng, không phải nội dung chữ như Ctrl + C.",[
  s("Home","Bold","Chuẩn bị đoạn mẫu","Định dạng một tiêu đề mẫu: cỡ lớn hơn và in đậm."),
  s("Home","Format Painter","Chọn nguồn và bấm Format Painter","Đặt con trỏ tại đoạn mẫu hoặc bôi đen, nhấn công cụ chiếc cọ ở Home."),
  s("Home","Normal","Quét đoạn cần áp dụng","Chọn đoạn đích để áp dụng định dạng tương tự; kiểm tra không thay chữ.","Hai tiêu đề có định dạng đồng nhất.")]),
 g("find-replace","Tìm và thay thế không làm sai nội dung","editing","Replace All tác động nhiều chỗ. Hãy thử Replace từng trường hợp, nhất là tên riêng và thuật ngữ.",[
  s("View","Navigation Pane","Tìm một cụm từ","Ctrl + F mở ô tìm kiếm; nhập cụm từ cần định vị."),
  s("Home","Normal","Kiểm tra từng kết quả","Nháy vào vị trí tìm thấy để đọc ngữ cảnh xung quanh."),
  s("Home","Normal","Thay thế an toàn","Ctrl + H để mở Replace; thử Replace một lần rồi mới cân nhắc Replace All.","Không thay nhầm nội dung khác.")]),
 g("practice-2","Thực hành tương tác: trình bày thông báo","paragraph","Để thao tác thực tế, mở Microsoft Word rồi làm theo từng bước trong mô phỏng.",[
  s("Home","Center","Định dạng tiêu đề","Chọn tiêu đề THÔNG BÁO, căn giữa và in đậm."),
  s("Home","Bullets","Liệt kê các yêu cầu","Tạo một danh sách 3 mục bằng Bullets hoặc Numbering."),
  s("Layout","Spacing","Kiểm tra khoảng cách","Đảm bảo giãn dòng và khoảng cách đoạn thống nhất; lưu bằng Ctrl + S.","Tệp thông báo đã định dạng và không có dấu cách dư.")],"THÔNG BÁO",sample,undefined,["Mang tài liệu","Thực hành trên máy","Lưu và nộp bài"])
],
"word-trang-bang-anh":[
 g("page-settings","Thiết lập khổ giấy và hướng trang","layout","Word thông dụng có Size → A4 và Orientation → Portrait/Landscape. Lề theo mẫu/đề, không có một con số áp cho mọi văn bản.",[
  s("Layout","Size","Chọn khổ A4","Mở Layout → Size và chọn A4 khi đề yêu cầu."),
  s("Layout","Orientation","Chọn trang dọc hoặc ngang","Portrait phù hợp nhiều văn bản thông thường; Landscape có thể giúp bảng rộng."),
  s("Layout","Margins","Chọn lề đúng yêu cầu","Dùng Layout → Margins; có thể chọn Custom Margins để đặt giá trị riêng.","Trang in có thông số phù hợp.")]),
 g("page-setup","Bố cục trước và sau khi đổi lề","layout","Tập trung quan sát vùng chữ bên trong trang, không thay bằng cách gõ thêm dấu cách.",[
  s("Layout","Size","Kiểm tra A4","Đặt khổ A4 trước khi chỉnh phần thân văn bản."),
  s("Layout","Margins","Đổi Margin","Chọn Custom Margins khi cần nhập số đo cụ thể theo hướng dẫn."),
  s("File","Print","Xem trước bố cục trang","Dùng Print Preview để kiểm tra nội dung có quá sát lề hoặc tràn trang.","Bố cục đọc được và không bị cắt khi in.")]),
 g("page-break","Ngắt trang bằng Ctrl + Enter","break","Page Break tách trang một cách ổn định. Không dùng nhiều Enter để đẩy chương mới xuống trang tiếp.",[
  s("Insert","Page Break","Đặt con trỏ ở vị trí cần tách","Đặt trước tiêu đề chương 2, chọn Insert → Page Break hoặc Ctrl + Enter."),
  s("View","Print Layout","Xem bố cục trang","Cuộn tới trang sau để xem tiêu đề có xuất hiện ở đầu trang mới."),
  s("Home","Normal","Xóa ngắt trang khi không cần","Bật ký tự định dạng ¶ trong Word thật và xóa dấu Page Break thích hợp.","Trang mới bắt đầu đúng chỗ.")],"CHƯƠNG 2. NỘI DUNG",sample),
 g("section-break","Section Break dùng khi đổi hướng riêng một phần","section","Section Break (Next Page) có thể tách một vùng có lề/hướng trang khác; tài liệu cơ bản chỉ dùng khi cần.",[
  s("Layout","Breaks","Mở menu Breaks","Đặt con trỏ trước phần cần định dạng khác, chọn Layout → Breaks."),
  s("Layout","Breaks","Chọn Section Break phù hợp","Next Page tạo section mới bắt đầu ở trang tiếp theo."),
  s("Layout","Orientation","Thay hướng cho section cần thiết","Kiểm tra thay đổi áp dụng cho section hiện tại, không vô tình đổi toàn tài liệu.","Mỗi section có thể có thiết lập riêng.")]),
 g("header-footer","Tạo Header và Footer rõ ràng","header","Header/Footer có thể lặp trên nhiều trang; phần trang đầu có thể cấu hình khác (Different First Page).",[
  s("Insert","Header","Chọn mẫu Header","Insert → Header, chọn mẫu đơn giản rồi nhập tên đơn vị ở đầu trang."),
  s("Insert","Footer","Chèn Footer","Chọn Insert → Footer, đặt ghi chú hoặc thông tin cần lặp."),
  s("Home","Normal","Thoát chế độ sửa đầu/chân trang","Dùng Close Header and Footer hoặc bấm đúp vào thân tài liệu.","Đầu/chân trang không trùng nội dung chính.")],"THÔNG BÁO",sample),
 g("page-number","Đánh số trang tự động ở Footer","pageNumber","Không gõ tay 'Trang 1', 'Trang 2' vì số trang sẽ sai khi chỉnh sửa nội dung.",[
  s("Insert","Page Number","Mở Page Number","Chọn Insert → Page Number và vị trí ở cuối trang (Bottom of Page) hoặc đầu trang."),
  s("Insert","Footer","Quan sát Footer","Xem vùng chân trang có xuất hiện số trang tự động."),
  s("File","Print","Kiểm tra các trang liên tiếp","Dùng Print Preview xác nhận số trang xuất hiện đúng thứ tự.","Số trang tự cập nhật khi thêm hoặc xóa trang.")]),
 g("table-basics","Nhận diện hàng, cột và ô trong bảng Word","table","Bảng minh họa được vẽ bằng HTML/CSS; thực tế chọn Insert → Table để tạo bảng Word.",[
  s("Insert","Table","Xác định cấu trúc bảng","Bảng gồm hàng ngang, cột dọc và từng ô giao nhau."),
  s("Insert","Table","Chọn quy mô bảng","Ví dụ ba cột gồm STT, Họ tên, Ghi chú và ba hàng dữ liệu."),
  s("Home","Normal","Kiểm tra từng giá trị","Gõ đúng thông tin vào từng ô, chuyển ô bằng Tab.","Dữ liệu nằm đúng hàng và cột.")],"DANH SÁCH HỌC VIÊN",sample,{headers:["STT","Họ và tên","Ghi chú"],rows:[["1","Nguyễn Văn An","Có mặt"],["2","Trần Thị Bình","Vắng"]]}),
 g("insert-table","Thao tác tạo bảng 3 cột × 4 hàng","table","Nhập dữ liệu vào Table thật; không gõ dấu | hoặc khoảng trắng giả bảng.",[
  s("Insert","Table","Chọn Insert → Table","Di chuột chọn 3 cột và 4 hàng (gồm hàng tiêu đề)."),
  s("Home","Normal","Nhập dữ liệu theo thứ tự","Gõ STT, Họ tên, Ghi chú ở hàng đầu, sau đó nhập ba dòng."),
  s("Home","Bold","Làm nổi bật hàng tiêu đề","Chọn các ô hàng đầu và định dạng chữ đậm.","Bảng có 3 cột và 4 hàng thực.")],"DANH SÁCH HỌC VIÊN",sample,{headers:["STT","Họ tên","Ghi chú"],rows:[["1","An","Có mặt"],["2","Bình","Vắng"],["3","Chi","Có mặt"]]}),
 g("table-edit","Thêm hàng, xóa cột và gộp ô trong bảng","table","Khi đặt con trỏ trong bảng Word, có các thẻ Table Design và Table Layout (tên có thể thay đổi).",[
  s("Insert","Table","Chọn đúng ô","Đặt con trỏ trong bảng, quan sát tab ngữ cảnh Table Layout."),
  s("Insert","Table","Thêm hoặc xóa cấu trúc","Dùng các lệnh Insert Above/Below, Delete Rows/Columns trong Table Layout."),
  s("Home","Center","Căn ô tiêu đề sau chỉnh","Nếu gộp ô làm tiêu đề, chỉ thực hiện ở nơi thật sự cần; căn lại nội dung.","Dữ liệu không mất khi thay đổi cấu trúc.")],"DANH SÁCH LỚP",sample,{headers:["STT","Họ và tên","Lớp"],rows:[["1","An","11A"],["2","Bình","11A"]]}),
 g("table-design","Trình bày bảng rõ và dễ in","table","Bảng trong tài liệu chính thức nên dùng viền nhẹ, dữ liệu thẳng cột, chiều rộng hợp lý.",[
  s("Insert","Table","Chọn bảng hiện có","Đặt con trỏ trong bảng, Word hiển thị công cụ riêng cho bảng."),
  s("Home","Bold","Định dạng dòng tiêu đề","Dùng chữ đậm cho hàng đầu; không lạm dụng nền sặc sỡ."),
  s("Layout","Margins","Kiểm tra khổ trang","Đảm bảo bảng không vượt lề, không ép chữ quá nhỏ chỉ để vừa trang.","Bảng in ra đủ cột và nhãn.")],"BẢNG THEO DÕI",sample,{headers:["Họ tên","Điểm","Xếp loại"],rows:[["An","8","Đạt"],["Bình","5","Đạt"]]}),
 g("insert-image","Chèn và đổi kích thước hình ảnh","image","Minh họa ảnh do CSS tạo; khi thao tác thật dùng ảnh hợp pháp và chỉnh từ góc để tránh bị méo.",[
  s("Insert","Pictures","Chọn nơi chèn","Đặt con trỏ gần đoạn muốn có hình, chọn Insert → Pictures."),
  s("Insert","Pictures","Chọn ảnh từ thiết bị","Duyệt tệp JPG/PNG tin cậy, chèn và quan sát kích thước ban đầu."),
  s("Home","Normal","Chỉnh ảnh theo tỷ lệ","Chọn ảnh, kéo từ góc để giữ tỉ lệ, tránh để ảnh che chữ.","Ảnh đặt đúng vị trí, không bị méo.")],"GIỚI THIỆU LỚP HỌC",["Lớp học tổ chức thực hành soạn thảo, bảng biểu và minh họa bằng hình ảnh."]),
 g("wrap-text","Đặt ảnh Inline hay Wrap Text","wrap","Picture Format → Wrap Text xuất hiện khi đã chọn ảnh; tùy kiểu bao chữ mà vị trí ảnh có thể thay đổi.",[
  s("Insert","Pictures","Chèn ảnh ở chế độ Inline","Ảnh mặc định thường nằm cùng dòng văn bản (In Line with Text)."),
  s("Home","Normal","Chọn Layout Options ở ảnh","Nhấp ảnh để mở tùy chọn bọc chữ, dùng Square/Tight khi thích hợp."),
  s("Home","Normal","Quan sát chữ bao quanh","Di chuyển ảnh ở vị trí an toàn, kiểm tra không đè tiêu đề hay bảng.","Ảnh và chữ có khoảng cách hợp lý.")],"TÀI LIỆU CÓ HÌNH ẢNH",["Chèn hình minh họa giúp giải thích thao tác nhanh hơn.","Đoạn văn cần giữ dễ đọc, không để hình đè chữ."]),
 g("toc-basic","Tạo mục lục tự động với Heading","toc","Mục lục dựa trên Styles (Heading 1/2), không dựa vào việc chỉ in đậm tiêu đề bằng tay.",[
  s("Home","Heading 1","Áp Heading cho đề mục","Chọn từng đề mục lớn và áp style Heading 1; mục nhỏ dùng Heading 2."),
  s("References","Table of Contents","Chèn mục lục","Đặt con trỏ ở đầu tài liệu, References → Table of Contents → Automatic Table."),
  s("References","Update Table","Cập nhật sau chỉnh sửa","Khi nội dung đổi trang, chọn Update Table để cập nhật số trang.","Danh sách đề mục và số trang khớp với nội dung.")],"MỤC LỤC",sample)
],
"word-ra-soat-in-an":[
 g("proofread","Quy trình đọc soát trước khi phát hành","review","Máy tính chỉ hỗ trợ tìm lỗi, không xác nhận nội dung, ngày tháng và tên riêng thay con người.",[
  s("Review","Editor","Quét lỗi được gợi ý","Chọn Review → Editor hoặc Spelling & Grammar tùy phiên bản."),
  s("Home","Normal","Kiểm tra bằng mắt","Đọc từng đoạn, đối chiếu ngày, tên lớp và các số liệu với yêu cầu."),
  s("File","Print","Kiểm tra trang cuối","Mở Print Preview để thấy lỗi tràn dòng, ngắt trang và phần ký.","Không thiếu nội dung hoặc lỗi trình bày rõ ràng.")]),
 g("spellcheck","Đọc đúng các gợi ý trong Editor","review","Editor không luôn hỗ trợ tiếng Việt đồng đều ở mọi phiên bản; không sửa tên riêng theo gợi ý máy móc.",[
  s("Review","Editor","Mở Editor","Word có thể liệt kê lỗi chính tả, ngữ pháp và một số gợi ý rõ ràng."),
  s("Review","Editor","Đọc nguyên câu","Kiểm tra tính đúng của gợi ý so với ý nghĩa văn bản."),
  s("Home","Normal","Chỉ sửa lỗi có thật","Sửa lỗi đã xác minh, bỏ qua đề nghị sai cho tên riêng hoặc thuật ngữ.","Nội dung đúng ý và ít lỗi gõ.")]),
 g("navigation","Tìm một thuật ngữ trong văn bản dài","editing","Ctrl + F để tìm; Ctrl + H để thay. Replace All cần kiểm tra kỹ trước khi áp dụng hàng loạt.",[
  s("View","Navigation Pane","Mở Navigation Pane","Chọn View → Navigation Pane hoặc Ctrl + F để mở ô tìm."),
  s("Home","Normal","Nhập cụm cần tìm","Ví dụ tìm 'học viên' để xem các vị trí xuất hiện trong tài liệu."),
  s("Home","Normal","Thay khi cần","Ctrl + H, dùng Replace từng vị trí rồi đọc lại ngữ cảnh.","Không sửa nhầm phần khác.")]),
 g("comments","Góp ý bằng Comments","review","Comments phục vụ trao đổi về bản thảo, không phải nội dung in ra; quyền sửa phụ thuộc nền tảng lưu và chia sẻ.",[
  s("Review","New Comment","Chọn đoạn cần góp ý","Bôi đen một câu còn chưa rõ hoặc có số liệu cần xác minh."),
  s("Review","New Comment","Thêm nhận xét","Chọn New Comment, ghi cụ thể nội dung cần sửa thay vì chỉ 'sửa lại'."),
  s("Home","Normal","Xử lý nhận xét","Người chỉnh sửa phản hồi hoặc Resolve sau khi đã kiểm tra và sửa.","Có dấu vết trao đổi và kết luận.")]),
 g("track-changes","Theo dõi và duyệt sửa bằng Track Changes","review","Track Changes không tự động chấp nhận mọi chỉnh sửa. Khi gửi bản cuối phải kiểm tra có cần Accept/Reject hay không.",[
  s("Review","Track Changes","Bật ghi nhận sửa đổi","Chọn Review → Track Changes trước khi bắt đầu sửa."),
  s("Review","Accept","Xem một thay đổi","Đọc nội dung thêm/xóa, chọn Accept nếu phù hợp yêu cầu."),
  s("Review","Reject","Từ chối thay đổi sai","Chọn Reject với sửa đổi không mong muốn; kiểm tra lại toàn bộ tài liệu.","Bản cuối được rà soát đầy đủ.")],"THÔNG BÁO",sample),
 g("print-preview","Xem trước trang Word khi in","print","Giao diện Backstage chỉ mô phỏng. Bản in thật phụ thuộc máy in, khổ giấy, font và tùy chọn in.",[
  s("File","Print","Mở Print Preview","Nhấn Ctrl + P hoặc File → Print để xem cách bố cục giấy."),
  s("Layout","Size","Đối chiếu khổ giấy","Kiểm tra trang A4 hoặc khổ được yêu cầu; xác nhận orientation."),
  s("File","Print","Kiểm tra toàn bộ trang","Quan sát dòng cuối, bảng, ảnh, đầu/chân trang trước khi chọn Print.","Không bị cắt nội dung, đúng số trang.")]),
 g("print-range","Chọn in toàn bộ hoặc một vài trang","print","Lệnh Print All Pages khác Custom Print. In hai mặt nghĩa là số tờ giấy có thể khác số trang.",[
  s("File","Print","Chọn máy in","Kiểm tra tên máy in, trạng thái kết nối và khổ giấy được máy hỗ trợ."),
  s("File","Print","Chọn phạm vi in","Print All Pages hoặc chọn các trang cụ thể (ví dụ 1,3-5) khi phù hợp."),
  s("File","Print","Đối chiếu số trang cần in","Kiểm tra Print Preview và chế độ in một/hai mặt để tránh in thừa.","Phạm vi trang đúng nhu cầu.")]),
 g("export-pdf","Xuất PDF giữ bố cục từ Word","export","PDF thường giữ bố cục khi chia sẻ; vẫn cần mở tệp PDF để kiểm tra trước khi nộp.",[
  s("File","Export","Mở File → Export","Chọn Create PDF/XPS hoặc Save As với loại tệp PDF."),
  s("File","PDF","Đặt tên PDF","Lưu cạnh tệp DOCX, ví dụ Bao_cao.docx và Bao_cao.pdf."),
  s("File","Open","Mở PDF vừa tạo","Kiểm tra font, ảnh, số trang và các ký tự tiếng Việt.","DOCX và PDF cùng nội dung, mỗi tệp đúng định dạng.")]),
 g("accessibility","Kiểm tra khả năng tiếp cận tài liệu","review","Heading, mô tả ảnh và thứ tự đọc quan trọng khi tài liệu được sử dụng bởi công cụ hỗ trợ.",[
  s("Home","Heading 1","Dùng đề mục đúng cấu trúc","Tiêu đề mục nên có style Heading, không chỉ tăng font."),
  s("Review","Check Accessibility","Chạy kiểm tra hỗ trợ đọc","Xem báo cáo của Accessibility Checker khi tính năng có trong phiên bản."),
  s("Insert","Pictures","Bổ sung mô tả ảnh","Với ảnh có thông tin quan trọng, thêm Alt Text mô tả ý nghĩa.","Tài liệu dễ tiếp cận và điều hướng.")]),
 g("final-sample","Bản Word hoàn chỉnh trước khi nộp","editing","Minh họa một mẫu học tập, không thay thế quy định thể thức văn bản hành chính của đơn vị.",[
  s("Home","Heading 1","Kiểm tra bố cục nội dung","Tiêu đề và các mục dùng phân cấp hợp lý."),
  s("Layout","Margins","Đối chiếu lề trang","Lề và cỡ chữ theo mẫu yêu cầu, không tự chọn tùy hứng."),
  s("File","Save","Lưu bản cuối","Ctrl + S rồi mở lại để xác nhận nội dung đã lưu.","Bản Word rõ ràng, đúng tệp.")],"THÔNG BÁO",["Về việc tổ chức thực hành Word cơ bản.","Thời gian: Theo kế hoạch lớp. Địa điểm: Phòng máy.","Học viên chuẩn bị tài liệu và nộp bài đúng thư mục."]),
 g("practice-final","Quy trình thực hành tổng hợp 3 bước","table","Bài thi thực hành phải làm trên Word thật; mô phỏng giúp xác định lệnh và đầu ra mong muốn.",[
  s("Insert","Table","Hoàn thiện bảng danh sách","Chèn bảng ba cột: STT, Họ tên, Ghi chú. Đảm bảo có tiêu đề và hàng dữ liệu."),
  s("Insert","Pictures","Thêm hình minh họa","Chèn ảnh đúng tỷ lệ, kiểm tra không che bảng hoặc nội dung."),
  s("File","Export","Xuất PDF và đối chiếu","Lưu bản .docx, xuất PDF, xem trước cả hai trước khi nộp.","Nộp DOCX và PDF đúng tên, đủ bảng/ảnh.")],"DANH SÁCH THỰC HÀNH",sample,{headers:["STT","Họ tên","Ghi chú"],rows:[["1","Học viên A","Đã nộp"],["2","Học viên B","Chưa nộp"]]})
]
};

/** Preserve original educational material and place the walkthrough after the relevant theory slide. */
export function enhanceWordLessons(lessons:PresentationLesson[]):PresentationLesson[] {
 return lessons.map(lesson=>{
  const entries=guides[lesson.id]??[];
  const lookup=new Map(entries.map(entry=>[entry.after,entry]));
  if(lookup.size!==entries.length)throw Error("Duplicate Word visual anchor: "+lesson.id);
  const original=lesson.slides;
  const slides:PresentationSlide[]=[];
  for(const slide of original){
   slides.push(slide);
   const guide=lookup.get(slide.id);
   if(!guide)continue;
   const id="word-demo-"+slide.id;
   const notes="MINH HỌA WORD BẰNG CSS – KHÔNG PHẢI PHẦN MỀM WORD THẬT. "+guide.steps.map((step,i)=>String(i+1)+". "+step[2]+": "+step[3]).join(" ")+" Ghi nhớ: "+guide.tip;
   slides.push({id,title:guide.title,layout:"full",eyebrow:"THAO TÁC WORD / MÔ PHỎNG",notes,blocks:[{
    type:"wordWorkspace",scene:guide.scene,filename:"Bai_thuc_hanh.docx",heading:guide.heading??"THÔNG BÁO",
    paragraphs:guide.paragraphs??sample,bullets:guide.bullets,table:guide.table,tip:guide.tip,
    steps:guide.steps.map(([tab,command,title,detail,result])=>({tab,command,title,detail,result}))
   }]});
  }
  const unused=entries.filter(g=>!original.some(slide=>slide.id===g.after));
  if(unused.length)throw Error("Missing slide anchors in "+lesson.id+": "+unused.map(x=>x.after).join(","));
  const originalIdFor=(i:number)=>original[i]?.id;
  const getStart=(i:number)=>slides.findIndex(s=>s.id===originalIdFor(i));
  const phases=lesson.phases?.map(p=>({...p,start:getStart(p.start)}));
  const sections=lesson.sections?.map(p=>({...p,start:getStart(p.start)}));
  if(phases?.some(p=>p.start<0)||sections?.some(p=>p.start<0))throw Error("Invalid chapter phase remap");
  return {...lesson,slides,phases,sections};
 });
}
export const WORD_VISUAL_GUIDE_COUNT=Object.values(guides).reduce((n,v)=>n+v.length,0);
