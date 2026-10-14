export const categories = [
  { code: "01", name: "Năng lực số", count: 8, mark: "◌" },
  { code: "02", name: "Excel", count: 6, mark: "fx" },
  { code: "03", name: "Word", count: 4, mark: "W" },
  { code: "04", name: "AI", count: 3, mark: "✦" },
];

export const courses = [
  { slug: "nang-luc-so-nen-tang", category: "Năng lực số", title: "Năng lực số nền tảng", lessons: 12, level: "Cơ bản", color: "bg-ink", accent: "text-cyan" },
  { slug: "excel-can-ban", category: "Excel", title: "Excel căn bản cho công việc", lessons: 9, level: "Cơ bản", color: "bg-cyan", accent: "text-ink" },
  { slug: "ai-cho-cong-viec", category: "AI", title: "AI cho học tập và công việc", lessons: 10, level: "Mọi cấp độ", color: "bg-paper", accent: "text-ink" },
];

export const courseDetail = {
  ...courses[1],
  description: "Làm chủ bảng tính từ những thao tác đầu tiên đến công thức, biểu đồ và báo cáo thực tế.",
  duration: "1 giờ 47 phút",
  students: 0,
  rating: null,
  chapters: [
    { title: "Làm quen với Excel", lessons: ["Giao diện và vùng làm việc", "Nhập và định dạng dữ liệu", "Thao tác với hàng và cột"] },
    { title: "Công thức nền tảng", lessons: ["Cấu trúc một công thức", "SUM, AVERAGE, MIN, MAX", "Tham chiếu tương đối và tuyệt đối"] },
    { title: "Ứng dụng vào công việc", lessons: ["Lập bảng theo dõi chi phí", "Trực quan hóa bằng biểu đồ", "Bài thực hành tổng hợp"] },
  ],
};

export const adminStats = [
  { label: "Người dùng", value: "—", delta: "Chưa kết nối dữ liệu" },
  { label: "Đang hoạt động", value: "—", delta: "Chưa kết nối dữ liệu" },
  { label: "Khóa học", value: "03", delta: "Dữ liệu mẫu" },
  { label: "Lượt làm bài", value: "—", delta: "Chưa kết nối dữ liệu" },
];

/**
 * Đáp án chỉ nằm trong bundle demo. Khi nối Supabase phải chấm điểm ở server;
 * không trả về correctIndex/is_correct cho client trước khi nộp bài.
 */
export const quizQuestions = [
  {
    id: 1,
    question: "Trong Excel, ký hiệu nào dùng để bắt đầu một công thức?",
    options: ["Dấu bằng (=)", "Dấu cộng (+)", "Dấu thăng (#)", "Dấu hai chấm (:)"],
    correctIndex: 0,
    explanation: "Công thức Excel luôn bắt đầu bằng dấu bằng (=), ví dụ =A1+B1.",
  },
  {
    id: 2,
    question: "Hàm nào dùng để tính tổng các ô từ B2 đến B8?",
    options: ["COUNT(B2:B8)", "AVERAGE(B2:B8)", "SUM(B2:B8)", "IF(B2:B8)"],
    correctIndex: 2,
    explanation: "SUM là hàm tính tổng. Công thức đầy đủ là =SUM(B2:B8).",
  },
  {
    id: 3,
    question: "Địa chỉ ô ở cột C, hàng 5 được viết như thế nào?",
    options: ["5C", "C5", "C:5", "C-5"],
    correctIndex: 1,
    explanation: "Địa chỉ ô trong Excel viết tên cột trước, số hàng sau: C5.",
  },
  {
    id: 4,
    question: "Tham chiếu nào giữ nguyên cả cột và hàng khi sao chép công thức?",
    options: ["A1", "A$1", "$A1", "$A$1"],
    correctIndex: 3,
    explanation: "$A$1 là tham chiếu tuyệt đối, cố định cả cột A và hàng 1.",
  },
  {
    id: 5,
    question: "Hàm nào tính giá trị trung bình của vùng B2:B8?",
    options: ["=AVERAGE(B2:B8)", "=MAX(B2:B8)", "=MIN(B2:B8)", "=SUM(B2:B8)"],
    correctIndex: 0,
    explanation: "AVERAGE tính trung bình cộng các giá trị số trong vùng tham chiếu.",
  },
  {
    id: 6,
    question: "Để so sánh chi phí giữa các tháng, biểu đồ nào thường phù hợp?",
    options: ["Biểu đồ phân tán", "Biểu đồ cột", "Biểu đồ radar", "Không cần biểu đồ"],
    correctIndex: 1,
    explanation: "Biểu đồ cột giúp so sánh giá trị của từng tháng hoặc từng nhóm.",
  },
];
