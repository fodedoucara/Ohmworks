import{ useState } from "react";
import styles from "./Workspace.module.css";

export default function Workspace() {
  const [placedComponents, setPlacedComponents] = useState([])
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
      </main>
    </div>
  );
}
