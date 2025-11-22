// src/pages/Workspace.jsx
import React from "react";
import styles from "./Workspace.module.css";

export default function Workspace() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Components</h2>
        <ul>
          <li draggable onDragStart={(e) => e.dataTransfer.setData("component", "microcontroller")}>Microcontroller</li>
          <li draggable onDragStart={(e) => e.dataTransfer.setData("component", "sensor")}>Sensor</li>
          <li draggable onDragStart={(e) => e.dataTransfer.setData("component", "led")}>LED</li>
          <li draggable onDragStart={(e) => e.dataTransfer.setData("component", "resistor")}>Resistor</li>
        </ul>
      </aside>
      <main className={styles.canvasArea}>
        <h2>Canvas</h2>
        <div className={styles.canvasPlaceholder}>
          {/* Later we’ll implement draggable components here */}
          <p>Drag components here to build your circuit</p>
        </div>
      </main>
    </div>
  );
}
