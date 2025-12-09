/* eslint-disable no-unused-vars */
import { useEffect, useRef, useCallback } from "react";
import { RESISTOR_BAND_OPTIONS } from "./resistorBands";


export default function ComponentRenderer({
  component,
  wires,
  setWires,
  selectedPin,
  setSelectedPin,
  blockDragRef,
  onPinLayout,
}) {
  const containerRef = useRef(null);

  /* ============================================================
     PIN CLICK LOGIC
  ------------------------------------------------------------ */
  const handlePinClick = useCallback((event, pinId) => {
    event.stopPropagation();
    event.preventDefault();

    const clicked = {
      componentId: component.id,
      pinId
    };

    // Use the functional update for setSelectedPin to access the previous value safely
    // without having 'selectedPin' in the useCallback dependency array.
    setSelectedPin(prevSelectedPin => {
      // First pin
      if (!prevSelectedPin) {
        return clicked; // Set the first pin
      }

      // Second pin → create wire
      // Only proceed if a different pin was clicked
      if (
        prevSelectedPin.componentId !== clicked.componentId ||
        prevSelectedPin.pinId !== clicked.pinId
      ) {
        // Use the stable setWires setter (functional update)
        setWires(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            from: prevSelectedPin, // Use the state value captured by the functional update
            to: clicked,
            color: "green"
          }
        ]);
      }
      // Clear selection after connection attempt or if same pin was clicked
      return null;
    });

    // Reset blockDragRef shortly after click
    setTimeout(() => (blockDragRef.current = false), 5);
  }, [component.id, setWires, setSelectedPin, blockDragRef]);

  function isPinSelected(pinId) {
    return (
      selectedPin &&
      selectedPin.componentId === component.id &&
      selectedPin.pinId === pinId
    );
  }

  /* ============================================================
     LOAD SVG + ATTACH PIN EVENTS
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!component.svg) return;

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    fetch(component.svg)
      .then(res => res.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgEl = svgDoc.documentElement;

        svgEl.style.width = `${component.width}px`;
        svgEl.style.height = `${component.height}px`;
        svgEl.style.pointerEvents = "auto";

        container.appendChild(svgEl);

        const svgPins = svgEl.querySelectorAll(".pin");
        console.log("SVG pins found:", svgPins.length);

        /* Attach interactivity to pins */
        svgPins.forEach(pinEl => {
          const pinId = pinEl.id;
          pinEl.style.cursor = "pointer";

          //Increase the clickable area of pins with a large, transparent stroke
          pinEl.setAttribute("stroke", "transparent");
          pinEl.setAttribute("stroke-width", "12");
          pinEl.setAttribute("vector-effect", "non-scaling-stroke");

          // MOUSE DOWN
          const mouseDownHandler = e => {
            e.stopPropagation();
            e.preventDefault();
            blockDragRef.current = true;
          };
          pinEl.addEventListener("mousedown", mouseDownHandler);

          // CLICK
          const clickHandler = e => {
            e.stopPropagation();
            e.preventDefault();
            handlePinClick(e, pinId);
          };
          pinEl.addEventListener("click", clickHandler);

          return () => {
            pinEl.removeEventListener("mousedown", mouseDownHandler);
            pinEl.removeEventListener("click", clickHandler);
          };
        });

        /* Collect pin-relative positions */
        if (onPinLayout) {
          requestAnimationFrame(() => {
            const pinsMap = {};
            const svgBox = svgEl.getBoundingClientRect();

            svgPins.forEach(pinEl => {
              const bbox = pinEl.getBoundingClientRect();
              pinsMap[pinEl.id] = {
                x: bbox.x - svgBox.x,
                y: bbox.y - svgBox.y
              };
            });

            console.log("PIN MAP FOR", component.id, pinsMap);
            onPinLayout(component.id, pinsMap);
          });
        }
      });
  }, [
    component.svg,
    component.width,
    component.height,
    component.id,
    onPinLayout,
    handlePinClick
  ]);

  /* ============================================================
     UPDATE PIN COLORS
  ------------------------------------------------------------ */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const svgEl = container.querySelector("svg");
    if (!svgEl) return;

    const svgPins = svgEl.querySelectorAll(".pin");

    svgPins.forEach(pinEl => {
      const pinId = pinEl.id;

      // Default color
      pinEl.setAttribute("fill", "#666");

      if (isPinSelected(pinId)) {
        pinEl.setAttribute("fill", "limegreen");
      }
    });
  }, [selectedPin, component.id]);

  /* ============================================================
   UPDATE LED COLOR
  ------------------------------------------------------------ */
  useEffect(() => {
      if (component.templateId !== "led") return;

      const container = containerRef.current;
      if (!container) return;

      const color = component.props?.Color || "#00ff00";

      container.style.setProperty("--led-color", color);
      container.style.setProperty("--led-stroke", color);
    }, [component.props?.Color, component.templateId]);

  /* ============================================================
   UPDATE RESISTOR BANDS
  ------------------------------------------------------------ */
  useEffect(() => {
    if (component.templateId !== "resistor") return;
    const container = containerRef.current;
    if (!container) return;

    container.style.setProperty("--band1-color", RESISTOR_BAND_OPTIONS.band1.find(o => o.value === component.props?.Band1)?.color || "#ff0000");
    container.style.setProperty("--band2-color", RESISTOR_BAND_OPTIONS.band2.find(o => o.value === component.props?.Band2)?.color || "#ffcc00");
    container.style.setProperty("--band3-color", RESISTOR_BAND_OPTIONS.band3.find(o => o.value === component.props?.Multiplier)?.color || "#000000");
    container.style.setProperty("--band4-color", RESISTOR_BAND_OPTIONS.band4.find(o => o.value === component.props?.Tolerance)?.color || "#ff9900");
}, [
    component.props?.Band1,
    component.props?.Band2,
    component.props?.Multiplier,
    component.props?.Tolerance,
    component.templateId
]);


  /* ============================================================
     RENDER
  ------------------------------------------------------------ */
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: component.width,
        height: component.height,
        userSelect: "none",
        pointerEvents: "auto"
      }}
    >
      {/* --- Dynamic Component Label Above --- */}
      {(() => {
        let label = null;

        switch (component.templateId) {
          case "resistor":
            label = component.props?.resistance;
            break;
          case "capacitor":
            label = component.props?.capacitance
              ? `${component.props.capacitance} µF`
              : null;
            break;
          case "diode":
            label = component.props?.forwardVoltage
              ? `${component.props.forwardVoltage} V`
              : null;
            break;
          case "led":
            label = component.props?.forwardVoltage
              ? `${component.props.forwardVoltage} V`
              : null;
            break;
          case "inductor":
            label = component.props?.inductance
              ? `${component.props.inductance} H`
              : null;
            break;
          default:
            break;
        }

        if (!label) return null;

        return (
          <div
            style={{
              position: "absolute",
              top: -18,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "12px",
              fontWeight: 500,
              background: "rgba(255,255,255,0.85)",
              color: "#333",
              padding: "1px 4px",
              borderRadius: "4px",
              pointerEvents: "none",
              whiteSpace: "nowrap"
            }}
          >
            {label}
          </div>
        );
      })()}
    </div>
  );


}