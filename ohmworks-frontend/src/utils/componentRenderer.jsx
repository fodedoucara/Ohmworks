/* eslint-disable no-unused-vars */

import { useEffect, useRef } from "react";

export default function ComponentRenderer({
  component,
  wires,
  setWires,
  selectedPin,
  setSelectedPin
}) {
  const containerRef = useRef(null);

  /* ============================================================
     UNIVERSAL PIN CLICK HANDLER
  ============================================================ */
  function handlePinClick(event, pinId) {
    event.stopPropagation();
    event.preventDefault();

    const clicked = {
      componentId: component.id,
      pinId
    };

    // First pin selected
    if (!selectedPin) {
      setSelectedPin(clicked);
      return;
    }

    // Second pin → create wire
    setWires((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        from: selectedPin,
        to: clicked,
        color: "green"
      }
    ]);

    // Reset selection
    setSelectedPin(null);
  }

  function isPinSelected(pinId) {
    return (
      selectedPin &&
      selectedPin.componentId === component.id &&
      selectedPin.pinId === pinId
    );
  }

  /* ============================================================
     LOAD & INJECT SVG
  ============================================================ */
  useEffect(() => {
    if (!component.svg) return;

    const container = containerRef.current;
    if (!container) return;

    // clear previous SVG if any
    container.innerHTML = "";

    fetch(component.svg)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgEl = svgDoc.documentElement;

        svgEl.style.width = `${component.width}px`;
        svgEl.style.height = `${component.height}px`;
        svgEl.style.pointerEvents = "auto";

        container.appendChild(svgEl);

        // Add click handlers to pins inside SVG
        const svgPins = svgEl.querySelectorAll(".pin");

        svgPins.forEach((pinEl) => {
          const pinId = pinEl.id;

          // highlight when selected
          if (isPinSelected(pinId)) {
            pinEl.setAttribute("fill", "limegreen");
          }

          pinEl.style.cursor = "pointer";
          pinEl.addEventListener("mousedown", (e) =>
            e.stopPropagation()
          );
          pinEl.addEventListener("click", (e) =>
            handlePinClick(e, pinId)
          );
        });
      });
  }, [component, selectedPin]);

  /* ============================================================
     RENDER CONTAINER (SVG will be injected inside)
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
