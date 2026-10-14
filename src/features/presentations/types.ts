export const PRESENTATION_LAYOUTS = [
  "cover", "full", "split", "split-reverse", "grid-2", "grid-3", "grid-4",
  "comparison", "steps", "split-demo", "wide-demo", "timeline",
  "focus", "quiz", "summary",
] as const;
export type PresentationLayout = typeof PRESENTATION_LAYOUTS[number];

/** Author slide content once; presentation design is owned by the XCN renderer. */
export type PresentationBlock = {
  type: string;
  [key: string]: any;
};

export interface PresentationSlide {
  id: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  layout: PresentationLayout;
  blocks: PresentationBlock[];
  notes?: string;
}

export interface PresentationLesson {
  id: string;
  title: string;
  subtitle?: string;
  label: string;
  kind?: string;
  sections?: {label: string; start: number}[];
  slides: PresentationSlide[];
}

export interface PresentationCourse {
  id: string;
  title: string;
  description: string;
  lessons: PresentationLesson[];
}
