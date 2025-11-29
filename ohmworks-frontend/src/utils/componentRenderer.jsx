import { computePinPosition } from "./computePinPosition";

export default function ComponentRenderer({ component }) {
  return (
    <div
      style={{
        position: "relative",
        width: component.width,
        height: component.height,
        background: "#e8f3ff",
        border: "2px solid #2363d1",
        borderRadius: "6px",
        boxSizing: "border-box",
        paddingTop: "6px",
        fontSize: "11px",
        fontWeight: 600,
        textAlign: "center",
        userSelect: "none"
      }}
    >
      {/* Component Label */}
      <div style={{ marginBottom: "2px" }}>
        {component.type.replace("_", " ").toUpperCase()}
      </div>

      {/* Pins */}
      {component.pins?.map((pin) => {
        const pos = computePinPosition(pin, component);

        return (
          <div
            key={pin.id}
            style={{
              position: "absolute",
              top: pos.y,
              left: pos.x,
              transform: "translate(-50%, -50%)",
              width: "10px",
              height: "10px",
              background: "red",
              borderRadius: "50%",
              border: "1px solid #222",
              cursor: "pointer",
              zIndex: 20
            }}
          >
            {/* Pin Label */}
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "9px",
                fontWeight: 500,
                color: "#333",
                whiteSpace: "nowrap",
                userSelect: "none"
              }}
            >
              {pin.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
