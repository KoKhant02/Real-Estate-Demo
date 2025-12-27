// ============================================
// REAL ESTATE MAP CONFIGURATION
// ============================================
// This file contains all configuration variables
// Modify these values to customize your real estate map

// -----------------
// GRID DIMENSIONS
// -----------------
export const GRID_ROWS = 10;
export const GRID_COLS = 10;
// Total blocks = GRID_ROWS × GRID_COLS = 10 × 15 = 150 blocks

// -----------------
// ROAD CONFIGURATION (NEW SIMPLE METHOD)
// -----------------
// How many blocks before adding a road?
// Example: If HORIZONTAL_BLOCKS_BEFORE_ROAD = 3
// It will add a horizontal road after every 3 rows of blocks
//
// HORIZONTAL_BLOCKS_BEFORE_ROAD = 3 with 10 rows:
//   Row 0-2   (3 rows of blocks)
//   ROAD      ← Road after row 3
//   Row 3-5   (3 rows of blocks)
//   ROAD      ← Road after row 6
//   Row 6-8   (3 rows of blocks)
//   ROAD      ← Road after row 9
//   Row 9     (1 row of blocks)
//
// VERTICAL_BLOCKS_BEFORE_ROAD = 5 with 15 cols:
//   Col 0-4 | ROAD | Col 5-9 | ROAD | Col 10-14

export const HORIZONTAL_BLOCKS_BEFORE_ROAD = 3;  // Rows per section
export const VERTICAL_BLOCKS_BEFORE_ROAD = 5;    // Columns per section

// -----------------
// BLOCK PRICING
// -----------------
export const MIN_BLOCK_PRICE = 75000;
export const MAX_BLOCK_PRICE = 250000;

// -----------------
// INITIAL SOLD PROBABILITY
// -----------------
// Probability that a block is already sold (0.0 to 1.0)
// 0.15 = 15% of blocks are already sold at start
export const INITIAL_SOLD_PROBABILITY = 0.15;

// -----------------
// STYLING
// -----------------
export const AVAILABLE_BLOCK_COLOR = "bg-yellow-400 border-yellow-500";
export const PURCHASED_BLOCK_COLOR = "bg-blue-500 border-blue-600";
export const ROAD_COLOR = "bg-slate-600";
export const BLOCK_GAP = 2;
export const BLOCK_BORDER_RADIUS = "rounded";

// -----------------
// DISPLAY OPTIONS
// -----------------
export const SHOW_BLOCK_NUMBERS = true;
export const SHOW_PURCHASE_PANEL = false;

// -----------------
// PROJECT INFO
// -----------------
export const PROJECT_NAME = "Sunset Valley Estates";
export const PROJECT_TAGLINE = "Premium Land Development Project";
export const PROJECT_LOCATION = "Yangon, Myanmar";
export const PROJECT_YEAR = "2025";
export const CONTACT_EMAIL = "sales@sunsetvalley.com";
export const CONTACT_PHONE = "+1 (555) 123-4567";