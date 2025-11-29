export function computePinPosition(pin, component) {
  const spacingTop = component.width / 14;   // 14 pins on top
  const spacingBottom = component.width / 6; // 6 analog pins
  const spacingSide = component.height / 8;  // 8 pins on each side

  let x = 0, y = 0;

  switch (pin.side) {
    case "top":
      x = spacingTop * pin.index + spacingTop / 2;
      y = 0;
      break;

    case "bottom":
      x = spacingBottom * pin.index + spacingBottom / 2;
      y = component.height;
      break;

    case "left":
      x = 0;
      y = spacingSide * pin.index + spacingSide / 2;
      break;

    case "right":
      x = component.width;
      y = spacingSide * pin.index + spacingSide / 2;
      break;

    default:
      break;
  }

  return { x, y };
}
