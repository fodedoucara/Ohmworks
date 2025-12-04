import fs from "fs";

// ===== CONFIG =====
const COLS = 30;
const ROWS_TOP = ["a", "b", "c", "d", "e"];
const ROWS_BOTTOM = ["f", "g", "h", "i", "j"];

const HOLE_SIZE = 8;
const HOLE_SPACING = 18;

const START_X = 40;
const START_Y_TOP = 110;
const START_Y_BOTTOM = 180;

const RAIL_TOP_POS_Y = 40;
const RAIL_TOP_NEG_Y = 62;

const RAIL_BOTTOM_NEG_Y = 296;
const RAIL_BOTTOM_POS_Y = 318;

const WIDTH = 800;
const HEIGHT = 425;

// rounded-square hole generator
function pin(id, x, y) {
  return `    <rect id="${id}" x="${x}" y="${y}" width="${HOLE_SIZE}" height="${HOLE_SIZE}" rx="2" ry="2" fill="#666"/>`;
}

// Generate a row (letters a–j)
function generateRow(rowLetter, y) {
  let out = "";
  for (let col = 1; col <= COLS; col++) {
    const x = START_X + (col - 1) * HOLE_SPACING;
    out += pin(`${rowLetter}${col}`, x, y) + "\n";
  }
  return out;
}

// Generate a rail (top/bottom)
function generateRail(prefix, y) {
  let out = "";
  for (let col = 1; col <= COLS; col++) {
    const x = START_X + (col - 1) * HOLE_SPACING;
    out += pin(`${prefix}_${col}`, x, y) + "\n";
  }
  return out;
}

// Generate column numbers
function generateColumnNumbers(y) {
  let out = "";
  for (let col = 1; col <= COLS; col++) {
    const x = START_X + (col - 1) * HOLE_SPACING + HOLE_SIZE / 2;
    out += `  <text x="${x}" y="${y}" font-size="10" text-anchor="middle" fill="#555">${col}</text>\n`;
  }
  return out;
}

// Generate row letters
function generateRowLetters(rows, startY) {
  let out = "";
  rows.forEach((letter, i) => {
    const y = startY + i * HOLE_SPACING + HOLE_SIZE;
    out += `  <text x="22" y="${y}" font-size="12" fill="#555">${letter}</text>\n`;
  });
  return out;
}

// ================== BUILD SVG ==================
let svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 640 340" xmlns="http://www.w3.org/2000/svg">

  <!-- Board background -->
  <rect x="10" y="10" width="620" height="320" rx="12" ry="12" fill="#f8f8f8" stroke="#d0d0d0" stroke-width="2"/>

  <!-- Power rails -->
  <line x1="32" y1="36" x2="608" y2="36" stroke="#e44" stroke-width="2"/>
  <line x1="32" y1="84" x2="608" y2="84" stroke="#48c" stroke-width="2"/>

  <line x1="32" y1="296" x2="608" y2="296" stroke="#48c" stroke-width="2"/>
  <line x1="32" y1="332" x2="608" y2="332" stroke="#e44" stroke-width="2"/>

  <!-- Rail labels -->
  <text x="18" y="40" font-size="12" fill="#e44">+</text>
  <text x="18" y="62" font-size="12" fill="#48c">-</text>

  <text x="18" y="292" font-size="12" fill="#48c">-</text>
  <text x="18" y="314" font-size="12" fill="#e44">+</text>

  <!-- Column numbers -->
  ${generateColumnNumbers(105)}
  ${generateColumnNumbers(275)}

  <!-- Row letters -->
  ${generateRowLetters(ROWS_TOP, START_Y_TOP)}
  ${generateRowLetters(ROWS_BOTTOM, START_Y_BOTTOM)}

  <!-- TOP RAIL PINS -->
  ${generateRail("rail_top_pos", RAIL_TOP_POS_Y)}
  ${generateRail("rail_top_neg", RAIL_TOP_NEG_Y)}

  <!-- INNER BLOCK (a–e) -->
  ${ROWS_TOP.map((r, i) => generateRow(r, START_Y_TOP + i * HOLE_SPACING)).join("")}

  <!-- INNER BLOCK (f–j) -->
  ${ROWS_BOTTOM.map((r, i) => generateRow(r, START_Y_BOTTOM + i * HOLE_SPACING)).join("")}

  <!-- BOTTOM RAIL PINS -->
  ${generateRail("rail_bottom_neg", RAIL_BOTTOM_NEG_Y)}
  ${generateRail("rail_bottom_pos", RAIL_BOTTOM_POS_Y)}

</svg>
`;

// Write to data.txt
fs.writeFileSync("data.txt", svg.trim(), "utf8");

console.log("SVG written to data.txt successfully!");
