export function computePinPosition(pin, component) {
  let x = 0;
  let y = 0;

  const spacingTop = component.width / 14;     // 14 digital pins on Arduino
  const spacingBottom = component.width / 6;   // 6 analog pins on Arduino
  const spacingSide = component.height / 8;    // 8 side pins

  switch (pin.side) {
    case "top":
      x = spacingTop * pin.index + spacingTop / 2;
      y = 0;
      return { x, y };

    case "bottom":
      x = spacingBottom * pin.index + spacingBottom / 2;
      y = component.height;
      return { x, y };

    case "left":
      x = 0;
      y = spacingSide * pin.index + spacingSide / 2;
      return { x, y };

    case "right":
      x = component.width;
      y = spacingSide * pin.index + spacingSide / 2;
      return { x, y };
  }


  if (pin.side === "internal") {
    // internal grid padding
    const paddingX = 40;  // horizontal margin inside board
    const paddingY = 60;  // vertical margin inside board

    const totalRows = 30; // rows for breadboard
    const totalCols = 10; // A–J

    // spacing between rows and columns
    const rowSpacing = (component.height - paddingY * 2) / totalRows;
    const colSpacing = (component.width - paddingX * 2) / totalCols;

    // convert letter A–J → 0–9
    const colIndex = "ABCDEFGHIJ".indexOf(pin.col);

    x = paddingX + colIndex * colSpacing + colSpacing / 2;
    y = paddingY + (pin.row - 1) * rowSpacing + rowSpacing / 2;

    return { x, y };
  }

  return { x: 0, y: 0 };
}
