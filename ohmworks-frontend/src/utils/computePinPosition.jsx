const ROW_COUNT = 30;          // rows 1–30
const COLS_PER_STRIP = 5;      // A–E or F–J
const COL_LETTERS_UPPER = ['A', 'B', 'C', 'D', 'E'];
const COL_LETTERS_LOWER = ['F', 'G', 'H', 'I', 'J'];
const GRID_COL_SPACE = 10;

export function computePinPosition(pin, component) {
  const w = component.width;
  const h = component.height;

  /* ----------------------------------------------------------
    ALL BREADBOARD PIN LAYOUTS
  ---------------------------------------------------------- */

  // ============================
  // 1. RAIL POSITIONS
  // ============================
  const TOP_PLUS_Y = h * 0.10;
  const TOP_MINUS_Y = h * 0.16;

  const BOTTOM_PLUS_Y = h * 0.84;
  const BOTTOM_MINUS_Y = h * 0.90;

  const RAIL_LEFT_X = 60;
  const RAIL_SPACING = (w - RAIL_LEFT_X * 2) / 25;


  // ============================
  // 2. INTERNAL GRID
  // ============================
  const GRID_LEFT_X = 120;
  const GRID_RIGHT_X = w - 120;

  const ROW_SPACING =
    1.2*(GRID_RIGHT_X - GRID_LEFT_X)/ (ROW_COUNT - 1);

  const UPPER_TOP_Y = h * 0.30;
  const UPPER_BOTTOM_Y = h * 0.45;
  const UPPER_COL_SPACING =
    (UPPER_BOTTOM_Y - UPPER_TOP_Y) / (COLS_PER_STRIP - 1);

  const LOWER_TOP_Y = h * 0.55;
  const LOWER_BOTTOM_Y = h * 0.70;
  const LOWER_COL_SPACING =
    (LOWER_BOTTOM_Y - LOWER_TOP_Y) / (COLS_PER_STRIP - 1);


  if (pin.rail === "top+") {
    return {
      x: RAIL_LEFT_X + pin.railIndex * RAIL_SPACING,
      y: TOP_PLUS_Y
    };
  }

  if (pin.rail === "top-") {
    return {
      x: RAIL_LEFT_X + pin.railIndex * RAIL_SPACING,
      y: TOP_MINUS_Y
    };
  }

  if (pin.rail === "bottom+") {
    return {
      x: RAIL_LEFT_X + pin.railIndex * RAIL_SPACING,
      y: BOTTOM_PLUS_Y
    };
  }

  if (pin.rail === "bottom-") {
    return {
      x: RAIL_LEFT_X + pin.railIndex * RAIL_SPACING,
      y: BOTTOM_MINUS_Y
    };
  }

  if (pin.side === "upper") {
    const rowIndex = pin.row - 1;
    const colIndex = COL_LETTERS_UPPER.indexOf(pin.colLetter);

    return {
      x: GRID_LEFT_X + rowIndex * ROW_SPACING,
      y: UPPER_TOP_Y + colIndex * UPPER_COL_SPACING
    };
  }


  if (pin.side === "lower") {
    const rowIndex = pin.row - 1;
    const colIndex = COL_LETTERS_LOWER.indexOf(pin.colLetter);

    return {
      x: GRID_LEFT_X + rowIndex * ROW_SPACING,
      y: LOWER_TOP_Y + colIndex * LOWER_COL_SPACING
    };
  }

  const spacingTop = w / 14;
  const spacingBottom = w / 6;
  const spacingSide = h / 8;

  if (pin.side === "top") {
    return { x: spacingTop * pin.index + spacingTop / 2, y: 0 };
  }
  if (pin.side === "bottom") {
    return { x: spacingBottom * pin.index + spacingBottom / 2, y: h };
  }
  if (pin.side === "left") {
    return { x: 0, y: spacingSide * pin.index + spacingSide / 2 };
  }
  if (pin.side === "right") {
    return { x: w, y: spacingSide * pin.index + spacingSide / 2 };
  }

  return { x: 0, y: 0 };
}
