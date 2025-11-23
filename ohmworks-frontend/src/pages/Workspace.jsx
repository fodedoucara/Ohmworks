import { useState, useRef, useEffect, useCallback} from "react";
import styles from "./Workspace.module.css";
import { COMPONENT_LIBRARY } from "../data/electronicComponents";
import {groupComponents} from "../utils/groupComponents.js"

const groupedComponents = groupComponents(COMPONENT_LIBRARY)

export default function Workspace() {
  //used for handling when components are placed inside canvas
  const [placedComponents, setPlacedComponents] = useState([])
  //used for handling components already inside canvas
  const [draggingId, setDraggingId] = useState(null)
  //used for handling positions of components inside canvas
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  //used to get reference of canvas border
  const canvasRef = useRef(null)
  //used to track selected component
  const [selectedId, setSelectedId] = useState(null);


  //used to search for components
  const [searchQuery, setSearchQuery] = useState("");
  //used to collapse down categories of components
  const [collapsed, setCollapsed] = useState({});

  const selectedComponent = placedComponents.find(c => c.id === selectedId);

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

    const compData = COMPONENT_LIBRARY.find(c => c.id === component)

    setPlacedComponents(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: component,
        x: clampedX,
        y: clampedY,
        props: { ...compData.defaultProps }
      }
    ]);
  };

  const handlePropertyChange = (id, key, value) => {
    setPlacedComponents(prev =>
      prev.map(c => c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c)
    );
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

  //listening for deleting item on canvas
const handleDelete = useCallback(() => {
  setPlacedComponents(prev => prev.filter(c => c.id !== selectedId));
  setSelectedId(null);
}, [selectedId]); // depends on selectedId

useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
      handleDelete();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [selectedId, handleDelete]);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Components</h2>

        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.sidebarContent}>
          {Object.entries(groupedComponents).map(([category, comps]) => {
            // Filter components when searching
            const filtered = comps.filter(c =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (filtered.length === 0) return null;

            return (
              <div key={category} className={styles.categoryGroup}>
                <div
                  className={styles.categoryHeader}
                  onClick={() =>
                    setCollapsed(prev => ({ ...prev, [category]: !prev[category] }))
                  }
                >
                  <h3>{category}</h3>
                  <span>{collapsed[category] ? "▸" : "▾"}</span>
                </div>

                {!collapsed[category] && (
                  <ul>
                    {filtered.map((comp) => (
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
                )}
              </div>
            );
          })}
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
          style={{ position: "relative" }}>
          {placedComponents.map(c => (
            <div
              key={c.id}
              onMouseDown={(e) => {
                const canvas = canvasRef.current;
                const canvasBorder = canvas.getBoundingClientRect();

                setDraggingId(c.id);
                setSelectedId(c.id);

                setOffset({
                  x: (e.clientX - canvasBorder.left) - c.x,
                  y: (e.clientY - canvasBorder.top) - c.y
                });
              }}
              className={`${styles.canvasItem} ${selectedId === c.id ? styles.selected : ""}`}
              style={{
                position: "absolute",
                top: c.y,
                left: c.x
              }}
            >
              {c.type}
            </div>
          ))}

          <p>Drag components here to build your circuit</p>
        </div>
        {/* Properties Panel */}
        {selectedComponent && (
          <div className={styles.propertiesPanel}>
            <h3>{selectedComponent.type} Properties</h3>
            {Object.entries(selectedComponent.props).map(([key, value]) => (
              <div key={key} className={styles.propRow}>
                <label>{key}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handlePropertyChange(selectedComponent.id, key, e.target.value)}
                />
              </div>
            ))}
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete
            </button>
          </div>
        )}

      </main >
    </div >
  );
}
