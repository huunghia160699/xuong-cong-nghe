/**
 * Nội dung học thử Excel căn bản. Chưa phải dữ liệu lấy từ Supabase.
 * Giữ slug ổn định để có thể ánh xạ sang bảng lessons sau này.
 */
export type DemoLesson = {
  slug: string;
  title: string;
  chapter: number;
  minutes: number;
  summary: string;
  points: string[];
  practice: string;
};

export const excelLessons: DemoLesson[] = [
  {
    slug: "giao-dien-va-vung-lam-viec", title: "Giao diện và vùng làm việc", chapter: 0, minutes: 8,
    summary: "Làm quen với sổ làm việc, trang tính, ô, hàng, cột và thanh công thức.",
    points: [
      "Một tệp Excel là workbook; trong đó có thể có nhiều worksheet (trang tính).",
      "Ô là giao điểm của hàng và cột; địa chỉ ô được viết dưới dạng A1, B2, C10.",
      "Name Box cho biết ô đang chọn; Formula Bar hiển thị nội dung hoặc công thức của ô.",
    ],
    practice: "Mở một trang tính và xác định các ô A1, C5, D10. Chọn từng ô và quan sát Name Box.",
  },
  {
    slug: "nhap-va-dinh-dang-du-lieu", title: "Nhập và định dạng dữ liệu", chapter: 0, minutes: 10,
    summary: "Nhập văn bản, số, ngày tháng và trình bày bảng dữ liệu dễ đọc.",
    points: [
      "Dữ liệu thường gồm văn bản, số, ngày tháng hoặc công thức.",
      "Định dạng hiển thị không tự làm thay đổi giá trị thực được lưu trong ô.",
      "Ưu tiên bảng có hàng tiêu đề, định dạng số nhất quán và không gộp ô trong vùng dữ liệu.",
    ],
    practice: "Tạo bảng Chi tiêu gồm Ngày, Nội dung, Số tiền; nhập 3 dòng và định dạng cột Số tiền có dấu phân cách hàng nghìn.",
  },
  {
    slug: "thao-tac-voi-hang-va-cot", title: "Thao tác với hàng và cột", chapter: 0, minutes: 8,
    summary: "Chèn, xóa, chỉnh chiều rộng cột và chiều cao hàng mà không làm rối dữ liệu.",
    points: [
      "Chọn tiêu đề cột hoặc hàng để thao tác với toàn bộ cột hoặc hàng.",
      "Double-click ranh giới tiêu đề cột để AutoFit theo nội dung.",
      "Kiểm tra vùng dữ liệu và công thức liên quan trước khi xóa hàng hoặc cột.",
    ],
    practice: "Chèn cột Đơn vị trước cột Số lượng, nhập dữ liệu và AutoFit tất cả các cột.",
  },
  {
    slug: "cau-truc-mot-cong-thuc", title: "Cấu trúc một công thức", chapter: 1, minutes: 10,
    summary: "Hiểu dấu bằng, toán tử và tham chiếu ô khi tính toán.",
    points: [
      "Công thức Excel bắt đầu bằng dấu bằng (=).",
      "Dùng địa chỉ ô để công thức tự cập nhật khi dữ liệu thay đổi, ví dụ =B2*C2.",
      "Dấu ngoặc xác định thứ tự tính toán: =(B2+C2)*D2.",
    ],
    practice: "Tạo các cột Số lượng, Đơn giá, Thành tiền và viết công thức nhân hai ô đầu tiên.",
  },
  {
    slug: "sum-average-min-max", title: "SUM, AVERAGE, MIN, MAX", chapter: 1, minutes: 12,
    summary: "Tổng hợp dữ liệu bằng bốn hàm thông dụng.",
    points: [
      "=SUM(B2:B8) cộng các số trong vùng B2 đến B8.",
      "=AVERAGE(B2:B8) tính trung bình cộng của các số.",
      "=MIN(B2:B8) và =MAX(B2:B8) tìm giá trị nhỏ nhất, lớn nhất.",
    ],
    practice: "Với danh sách điểm ở B2:B8, tính tổng, trung bình, thấp nhất và cao nhất.",
  },
  {
    slug: "tham-chieu-tuong-doi-va-tuyet-doi", title: "Tham chiếu tương đối và tuyệt đối", chapter: 1, minutes: 12,
    summary: "Sao chép công thức chính xác bằng cách hiểu A1, $A$1 và tham chiếu hỗn hợp.",
    points: [
      "A1 là tham chiếu tương đối: thay đổi theo vị trí khi sao chép công thức.",
      "$A$1 cố định cả cột A và hàng 1.",
      "$A1 cố định cột; A$1 cố định hàng.",
    ],
    practice: "Đặt tỷ lệ thuế ở F1. Tính thuế cho các hàng bằng công thức =D2*$F$1 rồi kéo xuống.",
  },
  {
    slug: "lap-bang-theo-doi-chi-phi", title: "Lập bảng theo dõi chi phí", chapter: 2, minutes: 15,
    summary: "Biến dữ liệu rời rạc thành bảng chi phí có công thức và tổng hợp.",
    points: [
      "Xác định cột bắt buộc: Ngày, Hạng mục, Diễn giải, Số tiền.",
      "Dùng một hàng cho một giao dịch và thống nhất định dạng tiền tệ.",
      "Tính tổng chi phí bằng SUM; kiểm tra dữ liệu trống trước khi báo cáo.",
    ],
    practice: "Lập bảng 5 khoản chi, tính tổng và lọc các khoản thuộc một hạng mục.",
  },
  {
    slug: "truc-quan-hoa-bang-bieu-do", title: "Trực quan hóa bằng biểu đồ", chapter: 2, minutes: 12,
    summary: "Chọn biểu đồ phù hợp với dữ liệu và diễn giải kết quả.",
    points: [
      "Biểu đồ cột phù hợp khi so sánh số liệu giữa các nhóm.",
      "Biểu đồ đường giúp quan sát xu hướng theo thời gian.",
      "Tiêu đề, nhãn và đơn vị phải phản ánh chính xác dữ liệu nguồn.",
    ],
    practice: "Từ bảng chi phí theo tháng, tạo biểu đồ cột và đặt tiêu đề Chi phí theo tháng.",
  },
  {
    slug: "bai-thuc-hanh-tong-hop", title: "Bài thực hành tổng hợp", chapter: 2, minutes: 20,
    summary: "Kết hợp nhập liệu, định dạng, công thức và biểu đồ trong một bảng báo cáo.",
    points: [
      "Chuẩn hóa dữ liệu và kiểm tra kiểu dữ liệu của từng cột.",
      "Áp dụng SUM, AVERAGE và tham chiếu tuyệt đối khi cần.",
      "Trình bày báo cáo rõ ràng với biểu đồ và phần tóm tắt.",
    ],
    practice: "Tạo báo cáo doanh thu 6 tháng, tính tổng và trung bình, sau đó tạo biểu đồ cột.",
  },
];

export function getExcelLesson(slug: string) {
  return excelLessons.find((lesson) => lesson.slug === slug);
}

export function getNextExcelLesson(slug: string) {
  const i = excelLessons.findIndex((lesson) => lesson.slug === slug);
  return i < 0 ? undefined : excelLessons[i + 1];
}

export function getPreviousExcelLesson(slug: string) {
  const i = excelLessons.findIndex((lesson) => lesson.slug === slug);
  return i > 0 ? excelLessons[i - 1] : undefined;
}
