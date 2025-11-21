// src/pages/Workspace.jsx
import React from "react";
import styles from "./Workspace.module.css";

export default function Workspace() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Components</h2>
        <ul>
          <li>Microcontroller</li>
          <li>Sensor</li>
          <li>LED</li>
          <li>Resistor</li>
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
