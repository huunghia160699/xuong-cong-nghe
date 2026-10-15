import "@/features/word-simulator/word-simulator.css";
import "@/features/word-simulator/word-home-ribbon.css";
import "@/features/word-simulator/word-window-bar.css";
import "@/features/word-simulator/word-font-ribbon.css";
import "@/features/word-simulator/word-paragraph-ribbon.css";
import "@/features/word-simulator/word-split-ribbon.css";
import "@/features/word-simulator/word-styles-ribbon.css";
import "@/features/word-simulator/word-interactions.css";
export default function WordSimulatorLayout({children}:{children:React.ReactNode}){
  return <div id="word-simulator-root">{children}</div>;
}
