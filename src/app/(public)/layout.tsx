import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="xcn-ui"><PublicHeader />{children}<Footer /></div>;
}
