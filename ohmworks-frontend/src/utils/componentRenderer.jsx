import { computePinPosition } from "./computePinPosition";

export default function ComponentRenderer({ component }) {
  const isBreadboard = component.behavior?.type === "breadboard";

  /* =================================================================
     BREADBOARD MINI RENDER
  ================================================================== */
  if (isBreadboard) {
    const rows = component.behavior.parameters.rows; // 30
    const cols = component.behavior.parameters.cols; // 5

    const leftCols = ["A", "B", "C", "D", "E"];
    const rightCols = ["F", "G", "H", "I", "J"];

    let pins = [];

    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `TOP_PLUS_${i}`,
        side: "rail-top",
        rail: "top+",
        railIndex: i
      });
    }
    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `TOP_MINUS_${i}`,
        side: "rail-top",
        rail: "top-",
        railIndex: i
      });
    }

    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        pins.push({
          id: `U_${leftCols[c]}${r}`,
          side: "upper",
          row: r,
          colLetter: leftCols[c]
        });
      }
    }
    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        pins.push({
          id: `L_${rightCols[c]}${r}`,
          side: "lower",
          row: r,
          colLetter: rightCols[c]
        });
      }
    }

    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `BOT_PLUS_${i}`,
        side: "rail-bottom",
        rail: "bottom+",
        railIndex: i
      });
    }

    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `BOT_MINUS_${i}`,
        side: "rail-bottom",
        rail: "bottom-",
        railIndex: i
      });
    }
    return (
      <div
        style={{
          position: "relative",
          width: component.width,
          height: component.height,
          background: "#eee",
          border: "2px solid #2363d1",
          borderRadius: "6px",
          boxSizing: "border-box",
          paddingTop: "6px",
          fontSize: "11px",
          fontWeight: 700,
          textAlign: "center",
          userSelect: "none"
        }}
      >
        <div style={{ marginBottom: "4px" }}>BREADBOARD MINI</div>

        {pins.map((pin) => {
          const pos = computePinPosition(pin, component);

          return (
            <div
              key={pin.id}
              style={{
                position: "absolute",
                top: pos.y,
                left: pos.x,
                transform: "translate(-50%, -50%)",
                width: pin.side === "upper" || pin.side === "lower" ? "9px" : "11px",
                height: pin.side === "upper" || pin.side === "lower" ? "9px" : "11px",
                background:
                  pin.rail === "top+" || pin.rail === "bottom+" ? "red" :
                  pin.rail === "top-" || pin.rail === "bottom-" ? "blue" :
                  "black",
                borderRadius: "50%",
                zIndex: 10
              }}
            />
          );
        })}
      </div>
    );
  }

  /* ============================================================
     NORMAL COMPONENTS RENDER
  ============================================================ */
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
      <div style={{ marginBottom: "2px" }}>
        {component.type.replace("_", " ").toUpperCase()}
      </div>

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
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "9px",
                fontWeight: 500,
                color: "#333"
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
