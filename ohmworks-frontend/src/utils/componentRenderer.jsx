/* eslint-disable no-unused-vars */

import { useEffect, useRef } from "react";

export default function ComponentRenderer({
  component,
  wires,
  setWires,
  selectedPin,
  setSelectedPin,
  blockDragRef
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

    // First pin
    if (!selectedPin) {
      setSelectedPin(clicked);
      return;
    }

    // Second pin → make wire
    setWires(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        from: selectedPin,
        to: clicked,
        color: "green"
      }
    ]);

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

        // Pin listeners
        const svgPins = svgEl.querySelectorAll(".pin");

        svgPins.forEach(pinEl => {
          const pinId = pinEl.id;
          pinEl.style.cursor = "pointer";

          // BLOCK DRAG WHILE CLICKING
          pinEl.addEventListener("mousedown", e => {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation?.();
            if (blockDragRef && "current" in blockDragRef) {
              blockDragRef.current = true;
            }
          });

          // CLICK
          pinEl.addEventListener("click", e => {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation?.();

            handlePinClick(e, pinId);

            setTimeout(() => {
              if (blockDragRef?.current !== undefined) {
                blockDragRef.current = false;
              }
            }, 30);
          });
        });
      });
  }, [component.svg, component.width, component.height]);

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

      pinEl.setAttribute("fill", "#666");

      if (isPinSelected(pinId)) {
        pinEl.setAttribute("fill", "limegreen");
      }
    });
  }, [selectedPin]);

  /* ============================================================
     RENDER CONTAINER
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
