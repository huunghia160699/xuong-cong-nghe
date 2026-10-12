export const siteConfig = {
  name: "Xưởng Công Nghệ",
  shortName: "XCN",
  description: "Nền tảng học và thực hành năng lực số.",
  slogan: "Học để hiểu. Làm để thành thạo.",
};

export const featureFlags = {
  // Chỉ bật khi đã cấu hình Supabase và kiểm tra RLS trên môi trường thực.
  supabase: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false",
  excelLab: false,
  wordLab: false,
  teacherWorkspace: false,
  payments: false,
  aiTutor: false,
} as const;
