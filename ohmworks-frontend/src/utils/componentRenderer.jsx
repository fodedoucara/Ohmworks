import { computePinPosition } from "./computePinPosition";

export default function ComponentRenderer({ component }) {
  const isBreadboard = component.behavior?.type === "breadboard";

  /* ============================================================
     BREADBOARD MINI (Fritzing-style)
     Auto-generate ALL pins
  ============================================================ */
  if (isBreadboard) {
    const rows = component.behavior.parameters.rows;         // 30
    const cols = component.behavior.parameters.cols;         // 5
    // const railSegments = component.behavior.parameters.railSegments;   // 5
    // const railPinsPerSegment = component.behavior.parameters.railPinsPerSegment; // 5

    const leftCols = ["A", "B", "C", "D", "E"];
    const rightCols = ["F", "G", "H", "I", "J"];

    let pins = [];

    /* --------------------------- */
    /* TOP RAIL: 25 + pins */
    /* --------------------------- */
    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `TOP_PLUS_${i}`,
        side: "top",
        rail: "top+",
        railIndex: i,
        label: "+"
      });
    }

    /* TOP RAIL: 25 - pins */
    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `TOP_MINUS_${i}`,
        side: "top",
        rail: "top-",
        railIndex: i,
        label: "-"
      });
    }

    /* --------------------------- */
    /* UPPER TERMINAL STRIP (A–E) */
    /* 30 rows × 5 cols           */
    /* --------------------------- */
    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        pins.push({
          id: `U_${leftCols[c]}${r}`,
          side: "upper",
          row: r,
          col: leftCols[c],
          label: ""   // no text inside grid
        });
      }
    }

    /* --------------------------- */
    /* LOWER TERMINAL STRIP (F–J) */
    /* 30 rows × 5 cols           */
    /* --------------------------- */
    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        pins.push({
          id: `L_${rightCols[c]}${r}`,
          side: "lower",
          row: r,
          col: rightCols[c],
          label: ""
        });
      }
    }

    /* --------------------------- */
    /* BOTTOM RAIL: 25 + pins */
    /* --------------------------- */
    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `BOT_PLUS_${i}`,
        side: "bottom",
        rail: "bottom+",
        railIndex: i,
        label: "+"
      });
    }

    /* BOTTOM RAIL: 25 - pins */
    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `BOT_MINUS_${i}`,
        side: "bottom",
        rail: "bottom-",
        railIndex: i,
        label: "-"
      });
    }

    /* ============================================================
       RENDER — breadboard version
    ============================================================ */
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
          fontWeight: 600,
          textAlign: "center",
          userSelect: "none"
        }}
      >
        <div style={{ marginBottom: "4px" }}>
          BREADBOARD MINI
        </div>

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
                width: pin.side === "upper" || pin.side === "lower" ? "8px" : "10px",
                height: pin.side === "upper" || pin.side === "lower" ? "8px" : "10px",
                background:
                  pin.rail === "top+" || pin.rail === "bottom+" ? "red" :
                  pin.rail === "top-" || pin.rail === "bottom-" ? "blue" :
                  "black",
                borderRadius: "50%"
              }}
            ></div>
          );
        })}
      </div>
    );
  }

  /* ============================================================
     NORMAL COMPONENT RENDER (Arduino, resistor, etc.)
     — This is YOUR ORIGINAL RENDER BLOCK unchanged
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
