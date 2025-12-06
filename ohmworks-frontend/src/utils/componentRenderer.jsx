/* eslint-disable no-unused-vars */
import { useEffect, useRef, useCallback } from "react";

export default function ComponentRenderer({
  component,
  wires,
  setWires,
  selectedPin,
  setSelectedPin,
  blockDragRef,
  onPinLayout
}) {
  const containerRef = useRef(null);

  /* ============================================================
     PIN CLICK LOGIC - REVISED FOR STABILITY
  ------------------------------------------------------------ */
  const handlePinClick = useCallback((event, pinId) => {
    event.stopPropagation();
    event.preventDefault();

    const clicked = {
      componentId: component.id, // Stable dependency: component.id
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
  }, [component.id, setWires, setSelectedPin, blockDragRef]); // Dependencies for useCallback are now stable setters/refs/id.

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

          // Set stroke to be transparent
          pinEl.setAttribute("stroke", "transparent");
          // Set the stroke width for larger target area
          pinEl.setAttribute("stroke-width", "20");
          // Ensure the stroke size doesn't change when the user zooms
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

          // CLEANUP
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
    handlePinClick // Now a memoized function, so it only changes when its own stable dependencies change
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
  }, [selectedPin, component.id]); // The color update still depends on selectedPin, but this doesn't re-attach listeners.

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
    />
  );
}