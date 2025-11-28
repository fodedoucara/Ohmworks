import { ICON_MAP } from "../utils/ICON_MAP.js";

export default function ComponentIcon({ id, size = 30, color = "#000" }) {
  const Icon = ICON_MAP[id];

  if (Icon) {
    return <Icon width={size} height={size} fill={color} />;
  }

  // Fallback placeholder if icon not found
  return <div style={{ width: size, height: size, background: "#ccc" }} />;
}