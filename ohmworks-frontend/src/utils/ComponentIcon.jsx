import React from "react";
import { ICON_MAP } from "../utils/ICON_MAP.js";

export default function ComponentIcon({ id, size = 30, color = "#000" }) {
  const Icon = ICON_MAP[id];
  if (!Icon) {
    // fallback placeholder if icon not found
    return <div style={{ width: size, height: size, background: "#ccc" }} />;
  }
  return <Icon size={size} color={color} />;
}
