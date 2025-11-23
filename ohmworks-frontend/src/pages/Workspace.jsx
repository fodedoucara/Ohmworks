
import styles from "./Workspace.module.css";
import { COMPONENT_LIBRARY } from "../data/electronicComponents";
import {groupComponents} from "../utils/groupComponents.js"
import {useCanvasInteractions} from "../utils/useCanvasInteractions.js"

const groupedComponents = groupComponents(COMPONENT_LIBRARY)

export default function Workspace() {
const {
    canvasRef,
    placedComponents,
    setDraggingId,
    setOffset,
    selectedId,
    setSelectedId,
    selectedComponent,
    searchQuery,
    setSearchQuery,
    collapsed,
    setCollapsed,
    handleDrop,
    handleDragOver,
    handleMouseMove,
    handleMouseUp,
    handlePropertyChange,
    handleDelete
} = useCanvasInteractions();

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
