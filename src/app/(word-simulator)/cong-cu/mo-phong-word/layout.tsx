import "@/features/word-simulator/word-simulator.css";
import "@/features/word-simulator/word-home-ribbon.css";
import "@/features/word-simulator/word-window-bar.css";
export default function WordSimulatorLayout({children}:{children:React.ReactNode}){
  return <div id="word-simulator-root">{children}</div>;
}
