/** CSS absolute lengths use exactly 96 CSS px per inch and 25.4 mm per inch.
 * A4 is 210 × 297 mm; don't round the paper size to whole CSS pixels. */
export const CSS_PX_PER_MM=96/25.4;
export const A4_WIDTH_PX=210*CSS_PX_PER_MM;
export const A4_HEIGHT_PX=297*CSS_PX_PER_MM;

export function a4Dimensions(landscape:boolean){
  return landscape
    ? {width:A4_HEIGHT_PX,height:A4_WIDTH_PX}
    : {width:A4_WIDTH_PX,height:A4_HEIGHT_PX};
}
