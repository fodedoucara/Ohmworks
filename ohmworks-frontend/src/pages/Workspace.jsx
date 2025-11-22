import { useState, useRef } from "react";
import styles from "./Workspace.module.css";
import { COMPONENT_LIBRARY } from "../data/electronicComponents";

const groupedComponents = COMPONENT_LIBRARY.reduce((acc, comp) => {
  if (!acc[comp.category]) acc[comp.category] = [];
  acc[comp.category].push(comp);
  return acc;
}, {});

export default function Workspace() {
  //used for handling when components are placed inside canvas
  const [placedComponents, setPlacedComponents] = useState([])
  //used for handling components already inside canvas
  const [draggingId, setDraggingId] = useState(null)
  //used for handling positions of components inside canvas
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  //used to get reference of canvas border
  const canvasRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault();
    const component = e.dataTransfer.getData("component");
    if (!component) {
      return
    }
    const canvas = canvasRef.current
    const canvasBorder = canvas.getBoundingClientRect()
    const x = e.clientX - canvasBorder.left;
    const y = e.clientY - canvasBorder.top;

    const clampedX = Math.max(0, Math.min(x, canvasBorder.width - 50))
    const clampedY = Math.max(0, Math.min(y, canvasBorder.height - 20))


    setPlacedComponents(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: component,
        x: clampedX,
        y: clampedY
      }
    ]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleMouseMove = (e) => {
    if (!draggingId) {
      return
    }

    const canvas = canvasRef.current
    const canvasBorder = canvas.getBoundingClientRect()

    const mouseX = e.clientX - canvasBorder.left
    const mouseY = e.clientY - canvasBorder.top

    setPlacedComponents(prev =>
      prev.map(c =>
        c.id === draggingId ? {
          ...c, x: Math.max(0, Math.min(mouseX - offset.x, canvasBorder.width - 50)),
          y: Math.max(0, Math.min(mouseY - offset.y, canvasBorder.height - 20))
        } : c
      )
    )
  }
  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Components</h2>
        <div className={styles.sidebarContent}>
          {Object.entries(groupedComponents).map(([category, components]) => (
            <div key={category} className={styles.categoryGroup}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              <ul>
                {components.map((comp) => (
                  <li
                    key={comp.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("component", comp.id)
                    }
                  >
                    {comp.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
      <main className={styles.canvasArea}>
        <h2>Canvas</h2>
        <div
          ref={canvasRef}
          className={styles.canvasPlaceholder}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ position: "relative" }}
        >

          {/* === Render placed components here === */}
          {placedComponents.map(c => (
            <div
              key={c.id}
              onMouseDown={(e) => {
                const canvas = canvasRef.current;
                const canvasBorder = canvas.getBoundingClientRect();

                setDraggingId(c.id);
                setOffset({
                  x: (e.clientX - canvasBorder.left) - c.x,
                  y: (e.clientY - canvasBorder.top) - c.y
                });
              }}
              style={{
                position: "absolute",
                top: c.y,
                left: c.x,
                background: "linear-gradient(90deg, #ff7a00, #ff4e00)",
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
