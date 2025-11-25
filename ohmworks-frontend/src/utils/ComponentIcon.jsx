import React, { useState } from "react";
import { ICON_MAP } from "../utils/ICON_MAP.js";

export default function ComponentIcon({ id, size = 30, color = "#000", image }) {
  const Icon = ICON_MAP[id];
  const [imgError, setImgError] = useState(false);

  // Backend json image path, show image only if it exists and hasn't errored
  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={id}
        width={size}
        height={size}
        style={{ objectFit:"contain" }}
        onError={() => setImgError(true)} // If image fails, switch to fallback
      />
    );
  }

  // Fallback to SVG Icon
  if (Icon) {
    return <Icon size={size} color={color} />;
  }
  return <div style={{ width: size, height: size, background: "#ccc" }} />; // Fallback placeholder if icon not found
}
