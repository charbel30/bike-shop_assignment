/** Layout constants from the Figma frames (390 x 844, iPhone 13/14). */

/** Width every Figma frame was drawn at; fluid layouts scale from this. */
export const DESIGN_WIDTH = 390;

/** Horizontal screen gutter (top navigation / content starts at x = 20). */
export const SCREEN_GUTTER = 20;

/** Figma's status bar height; used as a floor for the top inset so web and Android match iOS. */
export const STATUS_BAR_HEIGHT = 44;

/** Gap between the status bar and the top navigation row (y = 60 in every frame). */
export const TOP_NAV_GAP = 16;

/** Tab bar (1:146): 20dp slanted top edge + 49dp tab row + home-indicator area. */
export const TAB_BAR = {
  slant: 20,
  row: 49,
  /** Home indicator area in Figma; used as a floor for the bottom safe-area inset. */
  homeIndicator: 34,
} as const;
