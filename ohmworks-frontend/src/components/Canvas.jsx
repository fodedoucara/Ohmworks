import styles from "../pages/Workspace.module.css";

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
          className={`${styles.canvasItem} ${
            selectedId === c.id ? styles.selected : ""
          }`}
          style={{
            position: "absolute",
            top: c.y,
            left: c.x,
          }}
        >
          {c.type}
        </div>
      ))}

      <p>Drag components here to build your circuit</p>
    </div>
  );
}
