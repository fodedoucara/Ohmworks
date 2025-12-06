import styles from "./Workspace.module.css";
import useComponents from "../utils/useComponents";
import { COMPONENT_LIBRARY } from "../data/electronicComponents";
import { groupComponents } from "../utils/groupComponents.js";
import { useCanvasInteractions } from "../utils/useCanvasInteractions";

import Sidebar from "../ui/Sidebar";
import Canvas from "../ui/Canvas";
import PropertiesPanel from "../ui/PropertiesPanel";

export default function Workspace() {
  const components = useComponents() || COMPONENT_LIBRARY;
  const groupedComponents = groupComponents(components);

  // Removed: const [wires, setWires] = useState([]);


  const {
    canvasRef,
    placedComponents,
    setPlacedComponents,
    draggingId,
    setDraggingId,
    offset,
    setOffset,
    selectedId,
    setSelectedId,
    selectedComponent,
    selectedWire, // NEW
    searchQuery,
    setSearchQuery,
    collapsed,
    setCollapsed,
    handleDrop,
    handleDragOver,
    handleMouseMove,
    handleMouseUp,
    handlePropertyChange,
    handleWirePropertyChange, // NEW
    handleDelete,
    blockDragRef,
    pinLayout,
    onPinLayout,
    selectedPin,
    setSelectedPin,
    wires, // NEW
    setWires, // NEW
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
          wires={wires}
          setWires={setWires}
          selectedPin={selectedPin}
          setSelectedPin={setSelectedPin}
          blockDragRef={blockDragRef}
          pinLayout={pinLayout}
          onPinLayout={onPinLayout}
        />

        <PropertiesPanel
          selectedComponent={selectedComponent}
          selectedWire={selectedWire} // NEW
          handlePropertyChange={handlePropertyChange} 
          handleWirePropertyChange={handleWirePropertyChange} // NEW
          handleDelete={handleDelete}
        />
      </main>
    </div>
  );
}