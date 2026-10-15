"use client";

import {useState} from "react";
import {ArrowRight,Check,FileText,LayoutTemplate,PencilLine} from "lucide-react";

/**
 * Standalone, bespoke lesson-two slide. Not a generic presentation grid.
 * The two real learning objectives control the CSS document preview.
 */
export function WordPurposeSlide(){
  const [mode,setMode]=useState<"edit"|"format">("edit");
  const isEdit=mode==="edit";
  return <div className="xcn-word-purpose h-full min-h-full w-full overflow-y-auto bg-paper text-ink" data-word-purpose-slide="true">
    <div className="xcn-word-purpose-inner">
      <div className="xcn-word-purpose-copy">
        <h2 className="xcn-word-purpose-title">Word dùng để<br/><span>làm gì?</span></h2>
        <p className="xcn-word-purpose-lead">Word giúp tạo nội dung và trình bày tài liệu rõ ràng, chuyên nghiệp.</p>
        <div className="xcn-word-purpose-choices" role="group" aria-label="Chọn chức năng để xem minh họa">
          <button type="button" aria-pressed={isEdit} onClick={()=>setMode("edit")}
            className={"xcn-word-purpose-choice "+(isEdit?"is-selected":"")}>
            <span className="xcn-word-purpose-choice-icon" aria-hidden="true"><PencilLine size={30} strokeWidth={1.7}/></span>
            <span className="xcn-word-purpose-choice-text">
              <strong>Soạn thảo</strong>
              <span>Tạo và chỉnh sửa chữ, bảng, hình ảnh trong tài liệu.</span>
            </span>
            <ArrowRight size={22} className="xcn-word-purpose-choice-arrow" aria-hidden="true"/>
          </button>
          <button type="button" aria-pressed={!isEdit} onClick={()=>setMode("format")}
            className={"xcn-word-purpose-choice "+(!isEdit?"is-selected":"")}>
            <span className="xcn-word-purpose-choice-icon" aria-hidden="true"><LayoutTemplate size={30} strokeWidth={1.7}/></span>
            <span className="xcn-word-purpose-choice-text">
              <strong>Trình bày</strong>
              <span>Định dạng nội dung rõ ràng để in hoặc chia sẻ.</span>
            </span>
            <ArrowRight size={22} className="xcn-word-purpose-choice-arrow" aria-hidden="true"/>
          </button>
        </div>
        <p className="xcn-word-purpose-instruction"><span className="xcn-word-purpose-instruction-dot" aria-hidden="true"/> Chọn một chức năng để xem sự thay đổi trên tài liệu.</p>
      </div>

      <div className="xcn-word-purpose-stage">
        <div className="xcn-word-purpose-stage-edge" aria-hidden="true"/>
        <div className="xcn-word-purpose-window" aria-label={"Minh họa tài liệu Word ở chế độ "+(isEdit?"soạn thảo":"trình bày")}>
          <div className="xcn-word-purpose-window-top">
            <span className="xcn-word-purpose-word-icon" aria-hidden="true">W</span>
            <span className="xcn-word-purpose-filename">Thong_bao_lop.docx</span>
            <span className="xcn-word-purpose-window-controls" aria-hidden="true">−　□　×</span>
          </div>
          <div className="xcn-word-purpose-tabs" aria-hidden="true">
            <span>File</span><strong>Home</strong><span>Insert</span><span>Layout</span><span>Review</span>
          </div>
          <div className="xcn-word-purpose-ribbon" aria-hidden="true">
            <div className="xcn-word-purpose-ribbon-font">
              <span className="xcn-word-purpose-select">Aptos　⌄</span>
              <span className="xcn-word-purpose-select">12　⌄</span>
            </div>
            <div className={"xcn-word-purpose-ribbon-actions "+(!isEdit?"is-highlighted":"")}>
              <b>B</b><i>I</i><u>U</u><span>☷</span><span>≡</span>
            </div>
            <span className="xcn-word-purpose-ribbon-caption">Font · Paragraph</span>
          </div>
          <div className="xcn-word-purpose-canvas">
            <div className="xcn-word-purpose-ruler" aria-hidden="true"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span></div>
            <article className={"xcn-word-purpose-paper "+(!isEdit?"is-formatted":"")}>
              <h3>THÔNG BÁO</h3>
              <p>Về việc tổ chức buổi thực hành Microsoft Word.</p>
              <p>Học viên chuẩn bị tài liệu và có mặt đúng giờ tại phòng máy.</p>
              {isEdit?
                <div className="xcn-word-purpose-inserted">
                  <span>Nội dung mới được thêm vào văn bản.</span><span className="xcn-word-purpose-caret" aria-hidden="true"/>
                </div>
                :
                <ul><li>Kiểm tra nội dung trước khi in.</li><li>Lưu đúng tên tài liệu.</li></ul>
              }
              <p className="xcn-word-purpose-signature">Người lập thông báo</p>
            </article>
          </div>
          <div className="xcn-word-purpose-status" aria-hidden="true"><span>Trang 1 / 1</span><span>100%</span></div>
        </div>
        <div className="xcn-word-purpose-outcome" aria-live="polite" aria-atomic="true">
          <div className="xcn-word-purpose-outcome-icon"><Check size={22} aria-hidden="true"/></div>
          <div>
            <strong>{isEdit?"Tạo và chỉnh sửa nội dung":"Định dạng tài liệu dễ đọc"}</strong>
            <span>{isEdit?"Thêm chữ, sửa câu, chèn nội dung vào vị trí cần thiết.":"Căn tiêu đề, phân cấp chữ và tổ chức các đoạn văn rõ ràng."}</span>
          </div>
        </div>
        <div className="xcn-word-purpose-corner-word" aria-hidden="true"><FileText size={54} strokeWidth={1}/></div>
      </div>
    </div>
    <p className="xcn-word-purpose-disclaimer">Giao diện Word được mô phỏng bằng CSS phục vụ giảng dạy; không phải phần mềm Microsoft Word đang chạy.</p>
  </div>;
}
