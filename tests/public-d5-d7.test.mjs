import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=path=>readFileSync(path,"utf8");

test("D5 news has seven topic filters, URL search, debounce and no fake published articles",()=>{
 const list=read("src/config/public-articles.ts");
 const client=read("src/components/public-news-explorer.tsx");
 const page=read("src/app/(public)/tin-tuc/page.tsx");
 for(const name of ["Hướng dẫn sử dụng","Tin học & ứng dụng","Giáo dục số","AI trong dạy học","Cập nhật sản phẩm","STEM & dự án"])assert.ok(list.includes(name));
 assert.match(list,/EDITORIAL_ARTICLES:readonly PublicArticle\[\]=\[\]/);
 assert.match(list,/article.status==="published"/);
 assert.match(client,/useSearchParams/);
 assert.match(client,/setTimeout\(/);
 assert.match(client,/role="search"/);
 assert.match(client,/aria-pressed=/);
 assert.match(client,/aria-live="polite"/);
 assert.match(client,/Xóa bộ lọc/);
 assert.match(client,/router\.replace\(/);
 assert.match(page,/canonical:"\/tin-tuc"/);
 assert.doesNotMatch(page,/PublicPendingPage/);
 assert.ok(!existsSync("src/app/(public)/tin-tuc/[slug]/page.tsx"),"No unapproved article routes");
});
test("D6 contact only publishes verified channels, no fake submission",()=>{
 const data=read("src/config/public-contact.ts");
 const page=read("src/app/(public)/lien-he/page.tsx");
 assert.match(data,/VERIFIED_CONTACT_CHANNELS:readonly ContactChannel\[\]=\[\]/);
 assert.match(page,/getContactTopic/);
 assert.match(page,/Kênh liên hệ đang được cập nhật/);
 assert.match(page,/\/lien-he\?topic=/);
 assert.match(page,/canonical:"\/lien-he"/);
 assert.match(page,/Biểu mẫu gửi thông tin sẽ chỉ xuất hiện/);
 assert.doesNotMatch(page,/<form\b|<input\b|type="submit"|onSubmit|gửi thành công/i);
});
test("D7 SEO publishes public sitemap and robots exclusions only",()=>{
 const sitemap=read("src/app/sitemap.ts");
 const robots=read("src/app/robots.ts");
 for(const route of ["/gioi-thieu","/bang-gia","/tin-tuc","/lien-he"])assert.ok(sitemap.includes('"'+route+'"'));
 assert.doesNotMatch(sitemap,/\/admin\/|\/student\/|\/tin-tuc\/\[slug\]/);
 for(const target of ["/admin/","/student/","/api/"])assert.ok(robots.includes('"'+target+'"'));
 const css=read("src/app/(public)/public.css");
 for(const name of [".xcn-news-search",".xcn-contact-grid","@media(max-width:540px)"])assert.ok(css.includes(name));
 assert.doesNotMatch(css,/(?:linear|radial|conic)-gradient\s*\(/i);
});
