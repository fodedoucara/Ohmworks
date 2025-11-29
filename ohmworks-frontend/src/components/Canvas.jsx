import styles from "../pages/Workspace.module.css";
import ComponentIcon from "../utils/ComponentIcon.jsx";

export default function Canvas({
  canvasRef,
  placedComponents,
  selectedId,
  setSelectedId,
  setDraggingId,
  setOffset,
  handleDrop,
  handleDragOver,
  handleMouseMove,
  handleMouseUp
}) {
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
      {placedComponents.map((c) => (
        <div
          key={c.id}
          onMouseDown={(e) => {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();

            setDraggingId(c.id);
            setSelectedId(c.id);

            setOffset({
              x: e.clientX - rect.left - c.x,
              y: e.clientY - rect.top - c.y,
            });
          }}
          className={`${styles.canvasItem} ${selectedId === c.id ? styles.selected : ""
            }`}
          style={{
            position: "absolute",
            top: c.y,
            left: c.x,
            width: c.width || 120,        // fallback values in case JSON doesn’t define them
            height: c.height || 160,
          }}
        >
          {/* Component graphic */}
          <ComponentIcon id={c.type} size={50} />

          {/* ----------------------------- */}
          {/* PIN RENDERING */}
          {/* ----------------------------- */}
          {c.pins?.map((pin) => (
            <div
              key={pin.id}
              className={styles.pin}
              style={{
                position: "absolute",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: selectedId === c.id ? "#ff4444" : "#cc0000",
                border: "1px solid #222",
                top: pin.y,
                left: pin.x,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                zIndex: 10,
              }}
            ></div>
          ))}
        </div>
      ))}

      <p style={{ opacity: 0.4 }}>Drag components here to build your circuit</p>
    </div>
  );
}
