import { BarChart3, BookOpen, ClipboardCheck, FileText, FolderKanban, Gauge, GraduationCap, Library, Presentation, Settings, Sparkles, Users, ShieldCheck, SlidersHorizontal, ScrollText, Activity } from "lucide-react";

/** Public marketing links are distinct from Admin/Student navigation. All targets resolve. */
export const publicNav = [
  { label: "Trang chủ", href: "/" },
  { label: "Hệ sinh thái", href: "/#he-sinh-thai" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Bảng giá", href: "/bang-gia" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;

/** Public product atlas links lead to real public destinations. */
export const publicEcosystemNav = [
  { label: "Khóa học", description: "Bài học và lộ trình", href: "/khoa-hoc", icon: "01" },
  { label: "Thực hành", description: "Word, trình chiếu và công cụ", href: "/cong-cu", icon: "02" },
  { label: "Kiểm tra", description: "Trắc nghiệm theo tài khoản", href: "/dang-nhap?next=%2Fstudent%2Fquiz", icon: "03" },
  { label: "Công cụ", description: "Không gian công cụ số", href: "/cong-cu", icon: "04" },
  { label: "Tài nguyên", description: "Nội dung học và tư liệu", href: "/khoa-hoc", icon: "05" },
  { label: "Dự án", description: "Học qua sản phẩm thực tế", href: "/#du-an", icon: "06" },
  { label: "Giáo viên", description: "Không gian đang phát triển", href: "/gioi-thieu#lo-trinh", icon: "07" },
] as const;

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
