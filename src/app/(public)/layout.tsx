import "./public.css";
import {Footer} from "@/components/footer";
import {PublicHeader} from "@/components/public-header";

export default function PublicLayout({children}:{children:React.ReactNode}){
 return <div className="xcn-ui xcn-public flex min-h-dvh flex-col">
  <a href="#noi-dung" className="xcn-public-skip">Bỏ qua điều hướng</a>
  <PublicHeader/>
  <div id="noi-dung" className="flex-1">{children}</div>
  <Footer/>
 </div>;
}
