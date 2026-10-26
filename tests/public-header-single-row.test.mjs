import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const brand = read("src/components/brand.tsx");
const header = read("src/components/public-header.tsx");
const css = read("src/app/globals.css");
const routes = read("src/config/navigation.ts");

test("Brand text is a single unbroken line in header and shared shell", () => {
  assert.match(brand, /whitespace-nowrap/);
  assert.match(brand, /xcn-brand-name/);
  assert.match(brand, /shrink-0/);
  assert.match(brand, /Xưởng Công Nghệ/);
  assert.match(css, /\.xcn-brand-name\s*\{[^}]*white-space:\s*nowrap;/s);
});

test("Public header never wraps into a second navigation row", () => {
  assert.match(css, /\.xcn-header-inner\s*\{[^}]*flex-wrap:\s*nowrap;/s);
  assert.doesNotMatch(css, /\.xcn-header-inner\s*\{[^}]*flex-wrap:\s*wrap;/s);
  assert.match(css, /@media\s*\(max-width:\s*1120px\)\s*\{\s*\.xcn-header-nav\s*\{\s*display:\s*none;/s);
  assert.match(css, /\.xcn-header-menu-panel\s*\{[^}]*position:\s*absolute;/s);
  assert.match(header, /<details className="xcn-header-menu">/);
  assert.match(header, /<summary className="xcn-header-menu-toggle" aria-label="Mở menu điều hướng">/);
  assert.match(header, /aria-label="Điều hướng trên điện thoại"/);
  assert.doesNotMatch(css, /\.xcn-header-nav\s*\{[^}]*order:\s*3;/s);
});

test("Small mobile retains navigation and account action", () => {
  assert.match(css, /@media\s*\(max-width:\s*440px\)/);
  assert.match(css, /\.xcn-header-actions\s*\{\s*display:\s*none;/);
  assert.match(css, /\.xcn-header-menu\s*\{\s*margin-inline-start:\s*auto;/);
  assert.match(header, /publicNav\.map\(\(item\) => <Link key=\{item\.href\}/);
  assert.match(header, /<Link href=\{live \? "\/dang-ky" : "\/student"\}>/);
  assert.match(header, /live && <Link href="\/dang-nhap">Đăng nhập<\/Link>/);
  assert.match(routes, /export const publicNav = \[/);
});
