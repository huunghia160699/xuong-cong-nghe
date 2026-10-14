"use client";

import { useEffect } from "react";

/**
 * Keep the page's snap viewport in sync with the real sticky header height.
 * The mobile nav may occupy a second row and font scaling can resize it.
 * No wheel/touch hijacking: CSS scroll-snap stays fully native.
 */
export function HomeSectionSnap() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-xcn-public-header]");
    if (!header) return;

    const root = document.documentElement;
    const updateHeaderOffset = () => {
      root.style.setProperty(
        "--xcn-snap-header-height",
        `${Math.ceil(header.getBoundingClientRect().height)}px`,
      );
    };

    updateHeaderOffset();
    const observer = typeof ResizeObserver === "undefined"
      ? null : new ResizeObserver(updateHeaderOffset);
    observer?.observe(header);
    window.addEventListener("resize", updateHeaderOffset);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateHeaderOffset);
      root.style.removeProperty("--xcn-snap-header-height");
    };
  }, []);

  return null;
}
