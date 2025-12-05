import fs from "fs";

// ========== CONFIG ==========
const COLS = 30;
const ROWS_TOP = ["a", "b", "c", "d", "e"];
const ROWS_BOTTOM = ["f", "g", "h", "i", "j"];

const HOLE_SIZE = 8;
const HOLE_SPACING = 18;

const PIN_START_X = 40;

// ============================================================
// Top Rail Stack
// ============================================================

const RAIL_HEIGHT = 2 * HOLE_SIZE + HOLE_SPACING; // Total rail (+) to rail (-) height

const RED_LINE_TOP = 10; // Top rail line y value (+)
const BLUE_LINE_TOP = RED_LINE_TOP + RAIL_HEIGHT + HOLE_SIZE; // Top rail line y value (-)

const RED_PINS_TOP  = RED_LINE_TOP + (RAIL_HEIGHT - HOLE_SPACING) / 2; // Y value of top pins
const BLUE_PINS_TOP = RED_PINS_TOP + HOLE_SPACING; // Y value of bottom pins

console.log("RED_PINS_TOP:", RED_PINS_TOP, "BLUE_PINS_TOP:", BLUE_PINS_TOP);

// ============================================================
// Inner Blocks (centered between rails)
// ============================================================

// Adjustable gaps
const INNER_TOP_GAP = 30; // Gap from top blue rail to top inner block
const TRENCH_GAP = 30; // Gap between top and bottom inner blocks
const INNER_BOTTOM_GAP = 20; // Gap from bottom inner block to bottom rail

const INNER_SPACE_TOP = BLUE_LINE_TOP + INNER_TOP_GAP; // Top Y of inner blocks

const Y_A = INNER_SPACE_TOP; // Top inner block start
const Y_F = Y_A + ROWS_TOP.length * HOLE_SPACING + TRENCH_GAP; // Bottom inner block start

const TRENCH_Y = Y_A + ROWS_TOP.length * HOLE_SPACING + 5; // Bottom of top inner block
const TRENCH_HEIGHT = TRENCH_GAP - 20; // Trench line height

// ============================================================
// Bottom Rail Stack (mirrors top stack)
// ============================================================

const RED_LINE_BOTTOM = Y_F + ROWS_BOTTOM.length * HOLE_SPACING + INNER_BOTTOM_GAP; // Bottom rail line y value (+)
const BLUE_LINE_BOTTOM = RED_LINE_BOTTOM + RAIL_HEIGHT + HOLE_SIZE; // Bottom rail line y value (-)

const RED_PINS_BOTTOM = RED_LINE_BOTTOM + (RAIL_HEIGHT - HOLE_SPACING) / 2; // Y value of top pins
const BLUE_PINS_BOTTOM = RED_PINS_BOTTOM + HOLE_SPACING; // Y value of bottom pins

console.log("RED_PINS_BOTTOM:", RED_PINS_BOTTOM, "BLUE_PINS_BOTTOM:", BLUE_PINS_BOTTOM);

// ============================================================
// X and Y Helpers
// ============================================================

const RAIL_END_X = PIN_START_X + (COLS - 1) * HOLE_SPACING + HOLE_SIZE; // X value for end of rail

const Y_COL_TOP = Y_A - 10; // Y value for top number labels
const Y_COL_BOTTOM = Y_F + (ROWS_BOTTOM.length) * HOLE_SPACING + HOLE_SIZE; // Y value for bottom number labels

console.log("Y_A:", Y_A, "Y_F:", Y_F);

// ============================================================
// SVG & Board Size
// ============================================================

const BOARD_BOTTOM = BLUE_LINE_BOTTOM + 10;
const BOARD_RIGHT = RAIL_END_X + PIN_START_X;

const SVG_WIDTH = BOARD_RIGHT;
const SVG_HEIGHT = BOARD_BOTTOM;

const BOARD_X = 0;
const BOARD_Y = 0;
const BOARD_W = SVG_WIDTH;
const BOARD_H = SVG_HEIGHT;

// ============================================================
// Helpers
// ============================================================

function pin(id, x, y) {
  return `<rect id="${id}" x="${x}" y="${y}" width="${HOLE_SIZE}" height="${HOLE_SIZE}" rx="2" ry="2" fill="#666"/>`;
}

function generateRow(rowName, y) {
  let out = "";
  for (let col = 1; col <= COLS; col++) {
    let x = PIN_START_X + (col - 1) * HOLE_SPACING;
    out += "  " + pin(`${rowName}${col}`, x, y) + "\n";
  }
  return out;
}

function generateRailGroups(prefix, y) {
  const holesPerRow = 25; // Total holes
  const groupSize = 5; // Holes per group
  const gapBetweenGroups = HOLE_SPACING; // Extra spacing between groups

  const numGroups = Math.ceil(holesPerRow / groupSize);
  const totalGapsWidth = (numGroups - 1.5) * gapBetweenGroups;
  const totalHolesWidth = holesPerRow * HOLE_SPACING;
  const totalWidth = totalHolesWidth + totalGapsWidth; // Total width of all holes + gaps

  const startX = PIN_START_X + (RAIL_END_X - PIN_START_X - totalWidth) / 2;

  let out = "";
  for (let i = 0; i < holesPerRow; i++) {
    const groupOffset = Math.floor(i / groupSize) * gapBetweenGroups;
    const x = startX + i * HOLE_SPACING + groupOffset;
    out += `  <rect id="${prefix}_${i + 1}" x="${x}" y="${y}" width="${HOLE_SIZE}" height="${HOLE_SIZE}" rx="2" ry="2" fill="#666"/>\n`;
  }
  return out;
}


function generateColumnNumbers(y) {
  let out = "";
  for (let col = 1; col <= COLS; col++) {
    let x = PIN_START_X + (col - 1) * HOLE_SPACING + HOLE_SIZE / 2;
    out += `  <text x="${x}" y="${y}" font-size="10" font-family="Arial" text-anchor="middle" fill="#555">${col}</text>\n`;
  }
  return out;
}

function generateRowLetters(rows, firstY) {
  let out = "";
  rows.forEach((letter, i) => {
    let y = firstY + i * HOLE_SPACING + HOLE_SIZE;
    out += `  <text x="22" y="${y}" font-size="12" font-family="Arial" fill="#555">${letter}</text>\n`;
  });
  return out;
}

// ============================================================
// SVG Build
// ============================================================

const svg = `
<svg width="${SVG_WIDTH}" height="${SVG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Board Background -->
  <rect x="${BOARD_X}" y="${BOARD_Y}" width="${BOARD_W}" height="${BOARD_H}"
        rx="12" ry="12" fill="#f8f8f8" stroke="#d0d0d0" stroke-width="2"/>

  <!-- TOP RAIL LINES -->
  <line x1="${PIN_START_X}" y1="${RED_LINE_TOP}" x2="${RAIL_END_X}" y2="${RED_LINE_TOP}" stroke="#e44" stroke-width="2"/>
  <line x1="${PIN_START_X}" y1="${BLUE_LINE_TOP}" x2="${RAIL_END_X}" y2="${BLUE_LINE_TOP}" stroke="#48c" stroke-width="2"/>

  <!-- TOP RAIL LABELS -->
  <text x="22" y="${RED_LINE_TOP + 3}" font-size="12" fill="#e44">+</text>
  <text x="22" y="${BLUE_LINE_TOP + 3}" font-size="12" fill="#48c">-</text>

  <!-- TOP RAIL PINS -->
  ${generateRailGroups("rail_top_pos", RED_PINS_TOP).trimStart()}
  ${generateRailGroups("rail_top_neg", BLUE_PINS_TOP).trimStart()}

  <!-- COLUMN NUMBERS (TOP) -->
  ${generateColumnNumbers(Y_COL_TOP).trimStart()}

  <!-- INNER BLOCK: ROW LETTERS a–e -->
  ${generateRowLetters(ROWS_TOP, Y_A).trimStart()}

  <!-- INNER PINS a–e -->
  ${ROWS_TOP.map((r, i) => generateRow(r, Y_A + i * HOLE_SPACING)).join("").trimStart()}

  <!-- INNER BLOCK: ROW LETTERS f–j -->
  ${generateRowLetters(ROWS_BOTTOM, Y_F).trimStart()}

  <!-- INNER PINS f–j -->
  ${ROWS_BOTTOM.map((r, i) => generateRow(r, Y_F + i * HOLE_SPACING)).join("").trimStart()}

  <!-- TRENCH GAP -->
  <rect x="0" y="${TRENCH_Y}" width="${BOARD_RIGHT}" height="${TRENCH_HEIGHT}" fill="#D1D1D6"/>

  <!-- COLUMN NUMBERS (BOTTOM) -->
  ${generateColumnNumbers(Y_COL_BOTTOM).trimStart()}

  <!-- BOTTOM RAIL LINES -->
  <line x1="${PIN_START_X}" y1="${RED_LINE_BOTTOM}" x2="${RAIL_END_X}" y2="${RED_LINE_BOTTOM}" stroke="#e44" stroke-width="2"/>
  <line x1="${PIN_START_X}" y1="${BLUE_LINE_BOTTOM}" x2="${RAIL_END_X}" y2="${BLUE_LINE_BOTTOM}" stroke="#48c" stroke-width="2"/>

  <!-- BOTTOM RAIL LABELS -->
  <text x="22" y="${RED_LINE_BOTTOM + 3}" font-size="12" fill="#e44">+</text>
  <text x="22" y="${BLUE_LINE_BOTTOM + 3}" font-size="12" fill="#48c">-</text>

  <!-- BOTTOM RAIL PINS -->
  ${generateRailGroups("rail_bottom_pos", RED_PINS_BOTTOM).trimStart()}
  ${generateRailGroups("rail_bottom_neg", BLUE_PINS_BOTTOM).trimStart()}
</svg>
`.trim();

// Write file
fs.writeFileSync("breadboard_mini.svg", svg, "utf8");
console.log("breadboard_mini.svg generated");