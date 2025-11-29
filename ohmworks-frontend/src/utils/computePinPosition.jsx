export function computePinPosition(pin, component) {
  const w = component.width;
  const h = component.height;

  // ===== RAIL CONFIG =====
  const RAIL_TOTAL = 25;                // 25 pins for +, 25 pins for -
  const RAIL_Y_TOP = 40;
  const RAIL_Y_BOTTOM = h - 40;

  // ===== GRID CONFIG =====
  const GRID_ROWS = 30;
  const GRID_COLS = 5;

  const GRID_LEFT_X = 60;
  const GRID_RIGHT_X = w - 60;
  const GRID_TOP_Y = 90;
  const GRID_BOTTOM_Y = h - 90;
  const GRID_GAP = 50;  // gap between strips

  // ============================================================
  // 1. TOP RAIL (top+, top-)
  // ============================================================
  if (pin.rail === "top+" || pin.rail === "top-") {
    const spacing = (w - 120) / RAIL_TOTAL; // 60px padding each side
    return {
      x: 60 + spacing * pin.railIndex + spacing / 2,
      y: RAIL_Y_TOP
    };
  }

  // ============================================================
  // 2. BOTTOM RAIL (bottom+, bottom-)
  // ============================================================
  if (pin.rail === "bottom+" || pin.rail === "bottom-") {
    const spacing = (w - 120) / RAIL_TOTAL;
    return {
      x: 60 + spacing * pin.railIndex + spacing / 2,
      y: RAIL_Y_BOTTOM
    };
  }

  // ============================================================
  // 3. UPPER TERMINAL STRIP (A–E)
  // ============================================================
  if (pin.side === "upper") {
    const colIndex = "ABCDE".indexOf(pin.col);    // 0–4
    const colSpacing = (w / 2 - 120) / (GRID_COLS - 1);

    const rowSpacing =
      (GRID_BOTTOM_Y - GRID_TOP_Y - GRID_GAP) / (GRID_ROWS * 2);

    return {
      x: GRID_LEFT_X + colIndex * colSpacing,
      y: GRID_TOP_Y + rowSpacing * pin.row
    };
  }

  // ============================================================
  // 4. LOWER TERMINAL STRIP (F–J)
  // ============================================================
  if (pin.side === "lower") {
    const colIndex = "FGHIJ".indexOf(pin.col);    // 0–4
    const colSpacing = (w / 2 - 120) / (GRID_COLS - 1);

    const rowSpacing =
      (GRID_BOTTOM_Y - GRID_TOP_Y - GRID_GAP) / (GRID_ROWS * 2);

    return {
      x: GRID_RIGHT_X - colIndex * colSpacing,
      y: GRID_TOP_Y + GRID_GAP + rowSpacing * pin.row
    };
  }

  // ============================================================
  // 5. NORMAL COMPONENTS (Arduino, LEDs, etc.)
  // ============================================================

  const spacingTop = w / 14;
  const spacingBottom = w / 6;
  const spacingSide = h / 8;

  if (pin.side === "top") {
    return {
      x: spacingTop * pin.index + spacingTop / 2,
      y: 0
    };
  }

  if (pin.side === "bottom") {
    return {
      x: spacingBottom * pin.index + spacingBottom / 2,
      y: h
    };
  }

  if (pin.side === "left") {
    return {
      x: 0,
      y: spacingSide * pin.index + spacingSide / 2
    };
  }

  if (pin.side === "right") {
    return {
      x: w,
      y: spacingSide * pin.index + spacingSide / 2
    };
  }

  return { x: 0, y: 0 };
}
