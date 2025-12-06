/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";

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
     PIN CLICK LOGIC
  ============================================================ */
  function handlePinClick(event, pinId) {
    event.stopPropagation();
    event.preventDefault();

    const clicked = {
      componentId: component.id,   // <-- instance ID, correct
      pinId
    };

    console.log("selectedPin BEFORE click:", selectedPin);

    // First pin
    if (!selectedPin) {
      setSelectedPin(clicked);
      return;
    }

    // Second pin → create wire
    setWires(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        from: selectedPin,
        to: clicked,
        color: "green"
      }
    ]);

    // Reset selection shortly after click
    setTimeout(() => setSelectedPin(null), 50);
  }

  function isPinSelected(pinId) {
    return (
      selectedPin &&
      selectedPin.componentId === component.id &&
      selectedPin.pinId === pinId
    );
  }

  /* ============================================================
     LOAD SVG + ATTACH PIN EVENTS
  ============================================================ */
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

          pinEl.addEventListener("mousedown", e => {
            e.stopPropagation();
            e.preventDefault();
            blockDragRef.current = true;
          });

          pinEl.addEventListener("click", e => {
            e.stopPropagation();
            e.preventDefault();
            handlePinClick(e, pinId);

            setTimeout(() => (blockDragRef.current = false), 5);
          });
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
  }, [component.svg, component.width, component.height,component.id]);

  /* ============================================================
     UPDATE PIN COLORS
  ============================================================ */
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
  }, [selectedPin]);

  /* ============================================================
     RENDER
  ============================================================ */
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
