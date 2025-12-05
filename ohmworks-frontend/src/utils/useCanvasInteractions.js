import { useState, useEffect, useCallback, useRef } from "react";
import useComponents from "./useComponents";

export function useCanvasInteractions() {
    // Prevent dragging when clicking SVG pins
    const blockDragRef = useRef(false);

    const [placedComponents, setPlacedComponents] = useState([]);
    const [draggingId, setDraggingId] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);

    const components = useComponents() || [];

    const [searchQuery, setSearchQuery] = useState("");
    const [collapsed, setCollapsed] = useState({});

    const selectedComponent = placedComponents.find(c => c.id === selectedId);

    /* ============================================================
       DROP — ADD COMPONENT TO CANVAS
    ============================================================ */
    const handleDrop = (e) => {
        e.preventDefault();

        const componentId = e.dataTransfer.getData("component");
        if (!componentId) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const compData = components.find(c => c.id === componentId);
        if (!compData) {
            console.warn("Component not found:", componentId);
            return;
        }

        const compWidth = compData.width || 120;
        const compHeight = compData.height || 160;

        const clampedX = Math.max(0, Math.min(x, rect.width - compWidth));
        const clampedY = Math.max(0, Math.min(y, rect.height - compHeight));

        setPlacedComponents(prev => [
            ...prev,
            {
                ...compData,
                id: crypto.randomUUID(),
                x: clampedX,
                y: clampedY,
                width: compWidth,
                height: compHeight
            }
        ]);
    };

    /* ============================================================
       DRAG — MOVE COMPONENT
    ============================================================ */
    const handleMouseMove = (e) => {
        if (!draggingId) return;

        // ⛔ Prevent drag when user clicked a pin
        if (blockDragRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setPlacedComponents(prev =>
            prev.map(c =>
                c.id === draggingId
                    ? {
                        ...c,
                        x: Math.max(0, Math.min(mouseX - offset.x, rect.width - c.width)),
                        y: Math.max(0, Math.min(mouseY - offset.y, rect.height - c.height))
                    }
                    : c
            )
        );
    };

    /* ============================================================
       MOUSE UP — STOP DRAGGING
    ============================================================ */
    const handleMouseUp = () => {
        setDraggingId(null);
        blockDragRef.current = false; // reset drag block
    };

    /* ============================================================
       DELETE COMPONENT
    ============================================================ */
    const handleDelete = useCallback(() => {
        setPlacedComponents(prev => prev.filter(c => c.id !== selectedId));
        setSelectedId(null);
    }, [selectedId]);

    /* ============================================================
       ENABLE DELETE VIA KEYBOARD
    ============================================================ */
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isTyping =
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA" ||
                e.target.isContentEditable;

            if (isTyping) return;

            if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
                handleDelete();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId, handleDelete]);

    return {
        canvasRef,
        placedComponents,
        setPlacedComponents,
        draggingId,
        setDraggingId,
        offset,
        setOffset,
        selectedId,
        setSelectedId,
        selectedComponent,
        searchQuery,
        setSearchQuery,
        collapsed,
        setCollapsed,
        handleDrop,
        handleDragOver: e => e.preventDefault(),
        handleMouseMove,
        handleMouseUp,
        handlePropertyChange: (id, key, value) =>
            setPlacedComponents(prev =>
                prev.map(c =>
                    c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c
                )
            ),
        handleDelete,
        blockDragRef 
    };
}
