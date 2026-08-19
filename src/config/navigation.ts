import { BarChart3, BookOpen, ClipboardCheck, FileText, FolderKanban, Gauge, GraduationCap, Library, Settings, Sparkles, Users } from "lucide-react";

export const publicNav = [
  { label: "Khóa học", href: "/khoa-hoc/excel-can-ban" },
  { label: "Luyện tập", href: "/student/quiz" },
  { label: "Tài nguyên", href: "/#tai-nguyen" },
  { label: "Công cụ", href: "/#cong-cu" },
  { label: "Dự án", href: "/#du-an" },
];

export const studentNav = [
  { label: "Tổng quan", href: "/student", icon: Gauge },
  { label: "Khóa học của tôi", href: "/student#courses", icon: GraduationCap },
  { label: "Trắc nghiệm", href: "/student/quiz", icon: ClipboardCheck },
  { label: "Kết quả", href: "/student#results", icon: BarChart3 },
  { label: "Tài nguyên", href: "/student#resources", icon: Library },
  { label: "Sổ tay", href: "/student#notes", icon: FileText },
];

export const adminNav = [
  { label: "Tổng quan", href: "/admin", icon: Gauge },
  { label: "Khóa học", href: "/admin#courses", icon: BookOpen },
  { label: "Câu hỏi & Quiz", href: "/admin#quiz", icon: ClipboardCheck },
  { label: "Tài nguyên", href: "/admin#resources", icon: Library },
  { label: "Dự án", href: "/admin#projects", icon: FolderKanban },
  { label: "Người dùng", href: "/admin#users", icon: Users },
  { label: "Hệ thống", href: "/admin#settings", icon: Settings },
  { label: "Tính năng mới", href: "/admin#features", icon: Sparkles },
];
