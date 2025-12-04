import fs from "fs";

// ========== CONFIG ==========
const COLS = 30;
const ROWS_TOP = ["a", "b", "c", "d", "e"];
const ROWS_BOTTOM = ["f", "g", "h", "i", "j"];

const HOLE_SIZE = 8;
const HOLE_SPACING = 18;

const PIN_START_X = 40;

// ============================================================
// TOP RAIL STACK (correct real-breadboard ordering)
// ============================================================

const RED_LINE_TOP = 10; // Top rail line height (+)

const RAIL_HEIGHT = 2 * HOLE_SIZE + HOLE_SPACING; // Total rail height (top to bottom rail line distance)

const BLUE_LINE_TOP = RED_LINE_TOP + RAIL_HEIGHT + HOLE_SIZE; // Top rail line height (-)

const RED_PINS_TOP  = RED_LINE_TOP + (RAIL_HEIGHT - HOLE_SPACING) / 2; // Y value of top pins
const BLUE_PINS_TOP = RED_PINS_TOP + HOLE_SPACING; // Y value of bottom pins

console.log("RED_PINS_TOP: " + RED_PINS_TOP, "BLUE_PINS_TOP: " + BLUE_PINS_TOP);

// ============================================================
// INNER BLOCKS (CENTER)
// ============================================================

// Distance from bottom rail line to inner pins
const Y_A = BLUE_LINE_TOP + 30; // start inner rows a–e
const TRENCH_GAP = 30;          // realistic center gap

const Y_F = Y_A + ROWS_TOP.length * HOLE_SPACING + TRENCH_GAP;

// // Column number labels
// const Y_COL_TOP = Y_A - 10;
// const Y_COL_BOTTOM = Y_F + ROWS_BOTTOM.length * HOLE_SPACING + 16;

// // ============================================================
// // BOTTOM RAIL STACK (MIRROR TOP EXACTLY)
// // ============================================================

const RED_LINE_BOTTOM = Y_F + ROWS_BOTTOM.length * HOLE_SPACING + 30; // Bottom rail line height (+)

const RAIL_HEIGHT_BOTTOM = 2 * HOLE_SIZE + HOLE_SPACING; // Total rail height (top to bottom rail line distance)

const BLUE_LINE_BOTTOM = RED_LINE_BOTTOM + RAIL_HEIGHT_BOTTOM + HOLE_SIZE; // Bottom rail line height (-)

const RED_PINS_BOTTOM  = RED_LINE_BOTTOM + (RAIL_HEIGHT_BOTTOM - HOLE_SPACING) / 2; // Y value of top pins
const BLUE_PINS_BOTTOM = RED_PINS_BOTTOM + HOLE_SPACING; // Y value of bottom pins

console.log("RED_PINS_BOTTOM: " + RED_PINS_BOTTOM, "BLUE_PINS_BOTTOM: " + BLUE_PINS_BOTTOM);

// ============================================================
// Idk
// ============================================================

// Rail end X coordinate
const RAIL_END_X = PIN_START_X + (COLS - 1) * HOLE_SPACING + HOLE_SIZE;

const Y_COL_TOP = Y_A - 10;
const Y_COL_BOTTOM = Y_F + ROWS_BOTTOM.length * HOLE_SPACING + 10;

// ============================================================
// SVG SIZE
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
// HELPERS
// ============================================================

function pin(id, x, y) {
  return `    <rect id="${id}" x="${x}" y="${y}" width="${HOLE_SIZE}" height="${HOLE_SIZE}" rx="2" ry="2" fill="#666"/>`;
}

function generateRow(rowName, y) {
  let out = "";
  for (let col = 1; col <= COLS; col++) {
    let x = PIN_START_X + (col - 1) * HOLE_SPACING;
    out += pin(`${rowName}${col}`, x, y) + "\n";
  }
  return out;
}

function generateRail(prefix, y) {
  let out = "";
  for (let col = 1; col <= COLS; col++) {
    let x = PIN_START_X + (col - 1) * HOLE_SPACING;
    out += pin(`${prefix}_${col}`, x, y) + "\n";
  }
  return out;
}

function generateColumnNumbers(y) {
  let out = "";
  for (let col = 1; col <= COLS; col++) {
    let x = PIN_START_X + (col - 1) * HOLE_SPACING + HOLE_SIZE / 2;
    out += `  <text x="${x}" y="${y}" font-size="10" text-anchor="middle" fill="#555">${col}</text>\n`;
  }
  return out;
}

function generateRowLetters(rows, firstY) {
  let out = "";
  rows.forEach((letter, i) => {
    let y = firstY + i * HOLE_SPACING + HOLE_SIZE;
    out += `  <text x="22" y="${y}" font-size="12" fill="#555">${letter}</text>\n`;
  });
  return out;
}

// ============================================================
// SVG BUILD
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
  <text x="22" y="${RED_LINE_TOP + 10}" font-size="12" fill="#e44">+</text>
  <text x="22" y="${BLUE_LINE_TOP + 10}" font-size="12" fill="#48c">-</text>

  <!-- TOP RAIL PINS -->
  ${generateRail("rail_top_pos", RED_PINS_TOP)}
  ${generateRail("rail_top_neg", BLUE_PINS_TOP)}

  <!-- COLUMN NUMBERS (TOP) -->
  ${generateColumnNumbers(Y_COL_TOP)}

  <!-- INNER BLOCK: ROW LETTERS a–e -->
  ${generateRowLetters(ROWS_TOP, Y_A)}

  <!-- INNER PINS a–e -->
  ${ROWS_TOP.map((r, i) => generateRow(r, Y_A + i * HOLE_SPACING)).join("")}

  <!-- INNER BLOCK: ROW LETTERS f–j -->
  ${generateRowLetters(ROWS_BOTTOM, Y_F)}

  <!-- INNER PINS f–j -->
  ${ROWS_BOTTOM.map((r, i) => generateRow(r, Y_F + i * HOLE_SPACING)).join("")}

  <!-- COLUMN NUMBERS (BOTTOM) -->
  ${generateColumnNumbers(Y_COL_BOTTOM)}

  <!-- BOTTOM RAIL LINES -->
  <line x1="${PIN_START_X}" y1="${RED_LINE_BOTTOM}" x2="${RAIL_END_X}" y2="${RED_LINE_BOTTOM}" stroke="#e44" stroke-width="2"/>
  <line x1="${PIN_START_X}" y1="${BLUE_LINE_BOTTOM}" x2="${RAIL_END_X}" y2="${BLUE_LINE_BOTTOM}" stroke="#48c" stroke-width="2"/>

  <!-- BOTTOM RAIL LABELS -->
  <text x="22" y="${RED_LINE_BOTTOM + 10}" font-size="12" fill="#e44">+</text>
  <text x="22" y="${BLUE_LINE_BOTTOM + 10}" font-size="12" fill="#48c">-</text>

  <!-- BOTTOM RAIL PINS -->
  ${generateRail("rail_bottom_pos", RED_PINS_BOTTOM)}
  ${generateRail("rail_bottom_neg", BLUE_PINS_BOTTOM)}

</svg>
`.trim();

// Write file
fs.writeFileSync("breadboard_mini.svg", svg, "utf8");
console.log("✔ breadboard.svg generated with perfect symmetry and correct rail geometry!");