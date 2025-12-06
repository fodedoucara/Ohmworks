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
    selectedWire,
    searchQuery,
    setSearchQuery,
    collapsed,
    setCollapsed,
    handleDrop,
    handleDragOver,
    handleMouseMove,
    handleMouseUp,
    handlePropertyChange,
    handleWirePropertyChange,
    handleDelete,
    blockDragRef,
    pinLayout,
    onPinLayout,
    selectedPin,
    setSelectedPin,
    wires,
    setWires,
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
          selectedWire={selectedWire}
          handlePropertyChange={handlePropertyChange} 
          handleWirePropertyChange={handleWirePropertyChange}
          handleDelete={handleDelete}
        />
      </main>
    </div>
  );
}