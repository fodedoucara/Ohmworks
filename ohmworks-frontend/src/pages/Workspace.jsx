import styles from "./Workspace.module.css";
import useComponents from "../hooks/useComponents"; // Used for backend json fetching, will replace component_library
import { COMPONENT_LIBRARY } from "../data/electronicComponents";
import { groupComponents } from "../utils/groupComponents.js"
import { useCanvasInteractions } from "../utils/useCanvasInteractions"
import Sidebar from "../components/Sidebar"
//const groupedComponents = groupComponents(COMPONENT_LIBRARY)
import Canvas from "../components/Canvas"
import PropertiesPanel from "../components/PropertiesPanel"


export default function Workspace() {
  //const canvas = useCanvasInteractions();

  const components = useComponents() || COMPONENT_LIBRARY; // Fetch components from backend
  const groupedComponents = groupComponents(components); // Group components by category

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
        <PropertiesPanel
          selectedComponent={selectedComponent}
          handlePropertyChange={handlePropertyChange}
          handleDelete={handleDelete}
        />


      </main >
    </div >
  );
}
