
import styles from "./Workspace.module.css";
import { COMPONENT_LIBRARY } from "../data/electronicComponents";
import { groupComponents } from "../utils/groupComponents.js"
import { useCanvasInteractions } from "../utils/useCanvasInteractions"
import Sidebar from "../components/Sidebar"
const groupedComponents = groupComponents(COMPONENT_LIBRARY)
import Canvas from "../components/Canvas"


export default function Workspace() {
  //const canvas = useCanvasInteractions();

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
    setPlacedComponents,
    draggingId,
    offset,
    handleDrop,
    handleDragOver,
    handleMouseMove,
    handleMouseUp,
    handlePropertyChange,
    handleDelete
  } = useCanvasInteractions();

  return (
    <div className={styles.container}>
      <Sidebar
        groupedComponents={groupedComponents}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <main className={styles.canvasArea}>
        <h2>Canvas</h2>
<Canvas
    canvasRef={canvasRef}
    placedComponents={placedComponents}
    setPlacedComponents={setPlacedComponents}
    draggingId={draggingId}
    setDraggingId={setDraggingId}
    selectedId={selectedId}
    setSelectedId={setSelectedId}
    offset={offset}
    setOffset={setOffset}
    handleDrop={handleDrop}
    handleDragOver={handleDragOver}
    handleMouseMove={handleMouseMove}
    handleMouseUp={handleMouseUp}
/>

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
