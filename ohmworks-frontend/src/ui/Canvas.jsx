/* eslint-disable no-unused-vars */
import styles from "../pages/Workspace.module.css";
import ComponentRenderer from "../utils/componentRenderer.jsx";
import { useCallback } from "react"; 

export default function Canvas({
  canvasRef,
  placedComponents,
  setPlacedComponents,
  draggingId,
  setDraggingId,
  selectedId,
  setSelectedId,
  offset,
  setOffset,
  handleDrop,
  handleDragOver,
  handleMouseMove,
  handleMouseUp,
  wires,
  setWires,
  selectedPin,
  setSelectedPin,
  blockDragRef,
  pinLayout,
  onPinLayout
}) {
  console.log("PIN LAYOUT KEYS:", Object.keys(pinLayout));
  console.log("WIRES:", wires);

  /* ------------------------------------------------------------
     Compute absolute wire anchor points
  ------------------------------------------------------------ */
  function getPinAbsolutePos(endpoint) {
    if (!endpoint) return null;

    // Find component instance
    const comp = placedComponents.find(c => c.id === endpoint.componentId);
    if (!comp) return null;

    const compPins = pinLayout?.[comp.id];
    if (!compPins) return null;

    const pinPos = compPins[endpoint.pinId];
    if (!pinPos) return null;

    return {
      x: comp.x + pinPos.x,
      y: comp.y + pinPos.y
    };
  }

  /* ------------------------------------------------------------
     Wire Click Handler
  ------------------------------------------------------------ */
  const handleWireClick = useCallback((e, wireId) => {
      e.stopPropagation();
      // Set the selected item to the wire ID
      setSelectedId(wireId); 
      // Clear selected pin, as selection is now on a wire
      setSelectedPin(null); 
  }, [setSelectedId, setSelectedPin]);


  return (
    <div
      ref={canvasRef}
      className={styles.canvasPlaceholder}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: "relative" }}
    >
      {/* ------------------------------------------------------
         Render placed components
      ------------------------------------------------------ */}
      {placedComponents.map((c) => (
        <div
          key={c.id}
          onMouseDown={(e) => {
            const rect = canvasRef.current.getBoundingClientRect();

            setDraggingId(c.id);
            setSelectedId(c.id);
            setSelectedPin(null); // Clear selected pin when a component is clicked

            setOffset({
              x: e.clientX - rect.left - c.x,
              y: e.clientY - rect.top - c.y
            });
          }}
          className={`${styles.canvasItem} ${selectedId === c.id ? styles.selected : ""
            }`}
          style={{
            position: "absolute",
            top: c.y,
            left: c.x
          }}
        >
          <ComponentRenderer
            component={c}
            wires={wires}
            setWires={setWires}
            selectedPin={selectedPin}
            setSelectedPin={setSelectedPin}
            blockDragRef={blockDragRef}
            onPinLayout={onPinLayout}
            selectedId={selectedId}
          />
        </div>
      ))}

      {/* ------------------------------------------------------
         WIRES OVERLAY
      ------------------------------------------------------ */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none" 
        }}
      >
        {wires.map((w) => {
          const from = getPinAbsolutePos(w.from);
          const to = getPinAbsolutePos(w.to);

          if (!from || !to) return null;

          const mx = (from.x + to.x) / 2;
          const d = `M ${from.x} ${from.y} C ${mx} ${from.y} ${mx} ${to.y} ${to.x} ${to.y}`;
          
          const isSelected = w.id === selectedId;

          return (
            <path
              key={w.id}
              d={d}
              onClick={(e) => handleWireClick(e, w.id)} 
              stroke={w.color || "green"}
              strokeWidth={isSelected ? 6 : 4} // Increase width if selected
              strokeOpacity={isSelected ? 1 : 0.9} 
              fill="none"
              strokeLinecap="round"
              style={{ pointerEvents: 'auto' }} // Enable clicking on the path
            />
          );
        })}
      </svg>

      <p style={{
        opacity: 0.4,
        position: "absolute",
        pointerEvents: "none"
      }}>
        Drag components here to build your circuit
      </p>
    </div>
  );
}