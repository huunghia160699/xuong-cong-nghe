import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(path)=>readFileSync(path,"utf8");
const pages=[
  "src/app/(public)/page.tsx",
  "src/app/(public)/khoa-hoc/page.tsx",
  "src/app/(public)/khoa-hoc/[slug]/page.tsx",
  "src/app/(public)/cong-cu/page.tsx",
  "src/app/(public)/cong-cu/trinh-chieu/page.tsx",
  "src/features/courses/components/live-course-detail.tsx",
];
test("header, footer and every public section share a consistent horizontal container",()=>{
  const css=read("src/app/globals.css");
  assert.match(css,/--xcn-content-max:\s*1680px/);
  assert.match(css,/--xcn-page-gutter:\s*clamp\(20px,\s*2\.5vw,\s*42px\)/);
  assert.match(css,/\.xcn-container\s*\{/);
  assert.match(read("src/components/public-header.tsx"),/className="xcn-container/);
  assert.match(read("src/components/footer.tsx"),/className="xcn-container/);
  for(const page of pages){
    const source=read(page);
    assert.match(source,/xcn-container/,page);
    assert.doesNotMatch(source,/mx-auto max-w-7xl/,page+" has a legacy narrow container");
    assert.doesNotMatch(source,/lg:px-8/,page+" overrides shared gutters");
  }
});
test("the font scale and dashboard header share the same design tokens",()=>{
 const css=read("src/app/globals.css");
 assert.match(css,/\.xcn-ui \.text-sm\s*\{\s*font-size:\s*\.9375rem/);
 assert.match(css,/\.xcn-ui \.text-xs\s*\{\s*font-size:\s*\.8125rem/);
 const publicLayout=read("src/app/(public)/layout.tsx");
 const appShell=read("src/components/app-shell.tsx");
 assert.match(publicLayout,/className="xcn-ui"/);
 assert.match(appShell,/className="xcn-ui min-h-screen/);
 assert.match(appShell,/className="xcn-app-header/);
 assert.match(appShell,/className="xcn-app-main"/);
 assert.doesNotMatch(appShell,/className="p-5 lg:p-8"/);
});
test("the presentation keeps its edge-to-edge layout outside site gutters",()=>{
 const player=read("src/features/presentations/components/player.tsx");
 const route=read("src/app/(presentation)/cong-cu/trinh-chieu/[lessonId]/page.tsx");
 assert.match(player,/h-\[100dvh\] w-full overflow-hidden/);
 assert.doesNotMatch(route,/xcn-container|xcn-ui/);
});

// Ensure layout changes do not regress into fixed-height filler sections.
test("public library and tool cards follow content height with fluid vertical spacing",()=>{
 const css=read("src/app/globals.css");
 const library=read("src/app/(public)/cong-cu/trinh-chieu/page.tsx");
 const tools=read("src/app/(public)/cong-cu/page.tsx");
 const home=read("src/app/(public)/page.tsx");
 const header=read("src/components/public-header.tsx");
 assert.match(css,/--xcn-page-vertical:\s*clamp\(22px,\s*4\.3dvh,\s*54px\)/);
 assert.match(css,/--xcn-block-gap:\s*clamp\(20px,\s*3\.4dvh,\s*40px\)/);
 assert.match(css,/\.xcn-header-nav\s*\{/);
 assert.match(header,/xcn-header-inner/);
 assert.match(header,/xcn-header-nav/);
 assert.doesNotMatch(library,/min-h-screen|min-h-56|grid-cols-3 border border-zinc-200 bg-white|Đã có nội dung/);
 assert.doesNotMatch(tools,/min-h-\[75vh\]|min-h-\[275px\]|min-h-\[320px\]/);
 assert.match(library,/xcn-page-pad/);
 assert.match(tools,/xcn-page-pad/);
 assert.match(home,/xcn-home-hero/);
 assert.doesNotMatch(home,/min-h-\[560px\]|min-h-\[480px\]|min-h-72/);
});
