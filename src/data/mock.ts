export const categories = [
  { code: "01", name: "Năng lực số", count: 8, mark: "◌" },
  { code: "02", name: "Excel", count: 6, mark: "fx" },
  { code: "03", name: "Word", count: 4, mark: "W" },
  { code: "04", name: "AI", count: 3, mark: "✦" },
];

export const courses = [
  { slug: "nang-luc-so-nen-tang", category: "Năng lực số", title: "Năng lực số nền tảng", lessons: 12, level: "Cơ bản", color: "bg-zinc-900", accent: "text-lime" },
  { slug: "excel-can-ban", category: "Excel", title: "Excel căn bản cho công việc", lessons: 18, level: "Cơ bản", color: "bg-[#dff1df]", accent: "text-zinc-900" },
  { slug: "ai-cho-cong-viec", category: "AI", title: "AI cho học tập và công việc", lessons: 10, level: "Mọi cấp độ", color: "bg-[#ece7fb]", accent: "text-zinc-900" },
];

export const courseDetail = {
  ...courses[1],
  description: "Làm chủ bảng tính từ những thao tác đầu tiên đến công thức, biểu đồ và báo cáo thực tế.",
  duration: "6 giờ 30 phút",
  students: 1248,
  rating: 4.9,
  progress: 64,
  chapters: [
    { title: "Làm quen với Excel", lessons: ["Giao diện và vùng làm việc", "Nhập và định dạng dữ liệu", "Thao tác với hàng và cột"] },
    { title: "Công thức nền tảng", lessons: ["Cấu trúc một công thức", "SUM, AVERAGE, MIN, MAX", "Tham chiếu tương đối và tuyệt đối"] },
    { title: "Ứng dụng vào công việc", lessons: ["Lập bảng theo dõi chi phí", "Trực quan hóa bằng biểu đồ", "Bài thực hành tổng hợp"] },
  ],
};

export const dashboardStats = [
  { label: "Khóa đang học", value: "03", note: "+1 tháng này" },
  { label: "Bài đã hoàn thành", value: "28", note: "7 ngày liên tiếp" },
  { label: "Điểm trung bình", value: "8.6", note: "Tăng 0.4 điểm" },
  { label: "Bài đã luyện", value: "42", note: "Top 18% tuần này" },
];

export const adminStats = [
  { label: "Người dùng", value: "2,480", delta: "+12.5%" },
  { label: "Đang hoạt động", value: "684", delta: "+8.2%" },
  { label: "Khóa học", value: "21", delta: "+2 mới" },
  { label: "Lượt làm bài", value: "8,942", delta: "+18.7%" },
];

export const quizQuestions = [
  {
    id: 1,
    question: "Trong Excel, ký hiệu nào dùng để bắt đầu một công thức?",
    options: ["Dấu bằng (=)", "Dấu cộng (+)", "Dấu thăng (#)", "Dấu hai chấm (:)"]
  },
  {
    id: 2,
    question: "Hàm nào tính tổng một vùng dữ liệu?",
    options: ["COUNT", "AVERAGE", "SUM", "IF"]
  },
];
