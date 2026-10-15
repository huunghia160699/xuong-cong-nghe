import type {Metadata} from "next";
import {WordSimulator} from "@/features/word-simulator/word-simulator";
export const metadata:Metadata={
  title:"Mô phỏng Microsoft Word · Xưởng Công Nghệ",
  description:"Công cụ thực hành Word trên trình duyệt với Ribbon, trang A4, định dạng chữ, bảng, ảnh và bản nháp cục bộ."
};
export default function WordSimulatorPage(){return <WordSimulator/>;}
