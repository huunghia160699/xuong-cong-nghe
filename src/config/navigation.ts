import { BarChart3, BookOpen, ClipboardCheck, FileText, FolderKanban, Gauge, GraduationCap, Library, Presentation, Settings, Sparkles, Users, ShieldCheck, SlidersHorizontal, ScrollText, Activity } from "lucide-react";

export const publicNav = [
  { label: "Khóa học", href: "/khoa-hoc" },
  { label: "Luyện tập", href: "/student/quiz" },
  { label: "Tài nguyên", href: "/#tai-nguyen" },
  { label: "Công cụ", href: "/cong-cu" },
  { label: "Dự án", href: "/#du-an" },
];

export const studentNav = [
  { label: "Tổng quan", href: "/student", icon: Gauge },
  { label: "Khóa học của tôi", href: "/student#courses", icon: GraduationCap },
  { label: "Trắc nghiệm", href: "/student/quiz", icon: ClipboardCheck },
  { label: "Kết quả", href: "/student#results", icon: BarChart3 },
  { label: "Tài nguyên", href: "/student#resources", icon: Library },
  { label: "Trình chiếu", href: "/cong-cu/trinh-chieu", icon: Presentation },
  { label: "Sổ tay", href: "/student#notes", icon: FileText },
];

export const adminNav = [
  { label: "Tổng quan", href: "/admin", icon: Gauge },
  { label: "Roadmap", href: "/admin/roadmap", icon: FolderKanban },
  { label: "Sitemap hệ thống", href: "/admin/sitemap", icon: Settings },
  { label: "Người dùng", href: "/admin/nguoi-dung", icon: Users },
  { label: "Phân quyền", href: "/admin/phan-quyen", icon: ShieldCheck },
  { label: "Cấu hình", href: "/admin/cau-hinh", icon: SlidersHorizontal },
  { label: "Nhật ký", href: "/admin/nhat-ky", icon: ScrollText },
  { label: "Giám sát", href: "/admin/he-thong", icon: Activity },
  { label: "Báo cáo", href: "/admin/bao-cao", icon: BarChart3 },
  { label: "Khóa học", href: "/admin/khoa-hoc", icon: BookOpen },
  { label: "Kho tài liệu", href: "/admin/kho-tai-lieu", icon: Library },
  { label: "Trình chiếu", href: "/cong-cu/trinh-chieu", icon: Presentation },
  { label: "Word Lab", href: "/cong-cu/mo-phong-word", icon: FileText },
];
