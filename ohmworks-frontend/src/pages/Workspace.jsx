import { useState } from "react";
import styles from "./Workspace.module.css";

export default function Workspace() {
  //used for handling when components are placed inside canvas
  const [placedComponents, setPlacedComponents] = useState([])
  //used for handling components already inside canvas
  const [draggingId, setDraggingId] = useState(null)
  //used for handling positions of components inside canvas
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleDrop = (e) => {
    e.preventDefault();
    const component = e.dataTransfer.getData("component");
    setPlacedComponents(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: component,
        x: e.clientX,
        y: e.clientY
      }
    ]);
  };

  const handleDragOver = (e) => e.preventDefault();

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
        <div
          className={styles.canvasPlaceholder}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ position: "relative" }}
        >

          {/* === Render placed components here === */}
          {placedComponents.map(c => (
            <div
              key={c.id}
              onMouseDown={(e) => {
                setDraggingId(c.id);
                setOffset({
                  x: e.clientX - c.x,
                  y: e.clientY - c.y
                });
              }}
              style={{
                position: "absolute",
                top: c.y,
                left: c.x,
                background: "#eee",
                padding: "5px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            >
              {c.type}
            </div>
          ))}

          <p>Drag components here to build your circuit</p>
        </div>
      </main >
    </div >
  );
}
