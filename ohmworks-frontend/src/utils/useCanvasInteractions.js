import { useState, useEffect, useCallback, useRef } from "react";
import useComponents from "./useComponents";

export function useCanvasInteractions() {
    const blockDragRef = useRef(false);

    // 🔥 MISSING BEFORE — this is required for wires to work
    const [selectedPin, setSelectedPin] = useState(null);

    const [placedComponents, setPlacedComponents] = useState([]);
    const [draggingId, setDraggingId] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);

    const [pinLayout, setPinLayout] = useState({});

    const components = useComponents() || [];
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsed, setCollapsed] = useState({});

    const selectedComponent = placedComponents.find(c => c.id === selectedId);

    /* ============================================================
       PIN GEOMETRY REPORT
    ============================================================ */
    const onPinLayout = useCallback((componentId, pinsMap) => {
        setPinLayout(prev => ({
            ...prev,
            [componentId]: pinsMap
        }));
    }, []);

    /* ============================================================
       DROP NEW COMPONENT
    ============================================================ */
    const handleDrop = (e) => {
        e.preventDefault();

        const componentId = e.dataTransfer.getData("component");
        if (!componentId) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const template = components.find(c => c.id === componentId);
        if (!template) return;

        const instanceId = crypto.randomUUID();

        const instance = {
            id: instanceId,
            templateId: template.id,
            name: template.name,
            svg: template.svg,
            pins: template.pins,
            groups: template.groups,
            width: template.width,
            height: template.height,
            x: Math.max(0, Math.min(x, rect.width - template.width)),
            y: Math.max(0, Math.min(y, rect.height - template.height))
        };

        setPlacedComponents(prev => [...prev, instance]);
    };

    /* ============================================================
       DRAG COMPONENTS
    ============================================================ */
    const handleMouseMove = (e) => {
        if (!draggingId) return;
        if (blockDragRef.current) return;

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

    const handleMouseUp = () => {
        setDraggingId(null);
        blockDragRef.current = false;
    };

    /* ============================================================
       DELETE COMPONENT
    ============================================================ */
    const handleDelete = useCallback(() => {
        setPlacedComponents(prev => prev.filter(c => c.id !== selectedId));
        setSelectedId(null);
    }, [selectedId]);

    /* ============================================================
       KEYBOARD DELETE
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

    /* ============================================================
       RETURN PUBLIC API
    ============================================================ */
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
        blockDragRef,
        selectedPin,
        setSelectedPin,
        pinLayout,
        onPinLayout
    };
}
