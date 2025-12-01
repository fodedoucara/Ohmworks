/* eslint-disable no-unused-vars */
import { computePinPosition } from "./computePinPosition";

export default function ComponentRenderer({
  component,
  wires,
  setWires,
  selectedPin,
  setSelectedPin
}) {
  const isBreadboard = component.behavior?.type === "breadboard";

  /* =================================================================
     UNIVERSAL PIN CLICK HANDLER
  ================================================================== */
  function handlePinClick(e, pin) {
    e.stopPropagation();  // prevents drag
    e.preventDefault(); 

    const clicked = {
      componentId: component.id,
      pinId: pin.id
    };

    if (!selectedPin) {
      setSelectedPin(clicked); // FIRST pin
    } else {
      // SECOND pin → make wire
      setWires(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          from: selectedPin,
          to: clicked,
          color: "green"
        }
      ]);

      setSelectedPin(null); // reset selection
    }
  }
  function isSelected(pin) {
    return (
      selectedPin &&
      selectedPin.componentId === component.id &&
      selectedPin.pinId === pin.id
    );
  }


  /* =================================================================
     BREADBOARD MINI RENDER
  ================================================================== */
  if (isBreadboard) {
    const rows = component.behavior.parameters.rows;
    const cols = component.behavior.parameters.cols;

    const leftCols = ["A", "B", "C", "D", "E"];
    const rightCols = ["F", "G", "H", "I", "J"];

    let pins = [];

    // TOP + rail
    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `TOP_PLUS_${i}`,
        side: "rail-top",
        rail: "top+",
        railIndex: i
      });
    }

    // TOP - rail
    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `TOP_MINUS_${i}`,
        side: "rail-top",
        rail: "top-",
        railIndex: i
      });
    }

    // UPPER grid (A–E)
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

    // LOWER grid (F–J)
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

    // BOTTOM + rail
    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `BOT_PLUS_${i}`,
        side: "rail-bottom",
        rail: "bottom+",
        railIndex: i
      });
    }

    // BOTTOM - rail
    for (let i = 0; i < 25; i++) {
      pins.push({
        id: `BOT_MINUS_${i}`,
        side: "rail-bottom",
        rail: "bottom-",
        railIndex: i
      });
    }

    /* =================================================================
       RENDER BREADBOARD
    ================================================================== */
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
              onMouseDown={(e) => {e.preventDefault()
                e.stopPropagation()
              }
              }     // prevents drag
              onClick={(e) => handlePinClick(e, pin)}     // select pin
              style={{
                columnGap: "10px",
                position: "absolute",
                top: pos.y,
                left: pos.x,
                transform: "translate(-50%, -50%)",
                width:
                  pin.side === "upper" || pin.side === "lower"
                    ? "15px"
                    : "18px",
                height:
                  pin.side === "upper" || pin.side === "lower"
                    ? "15px"
                    : "18px",
                background: isSelected(pin)
                  ? "limegreen" // <-- Selected state
                  : pin.rail === "top+" || pin.rail === "bottom+"
                    ? "red"
                    : pin.rail === "top-" || pin.rail === "bottom-"
                      ? "blue"
                      : "black",
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 9999
              }}
            />
          );
        })}
      </div>
    );
  }

  /* =================================================================
     NORMAL COMPONENTS (Arduino, LEDs, etc.)
  ================================================================== */

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
            onMouseDown={(e) => {
              e.stopPropagation()
              e.preventDefault()}}
            onClick={(e) => handlePinClick(e, pin)}
            style={{
              position: "absolute",
              top: pos.y,
              left: pos.x,
              transform: "translate(-50%, -50%)",
              width: "15px",
              height: "15px",
              background: isSelected(pin) ? "limegreen" : "red",
              borderRadius: "50%",
              border: "1px solid #222",
              cursor: "pointer",
              zIndex: 9999
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
