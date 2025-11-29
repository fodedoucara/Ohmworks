import { useState, useEffect, useCallback, useRef } from "react";
import useComponents from "../hooks/useComponents";

export function useCanvasInteractions() {
    //used for handling when components are placed inside canvas
    const [placedComponents, setPlacedComponents] = useState([])
    //used for handling components already inside canvas
    const [draggingId, setDraggingId] = useState(null)
    //used for handling positions of components inside canvas
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    //used to get reference of canvas border
    const canvasRef = useRef(null)
    //used to track selected component
    const [selectedId, setSelectedId] = useState(null);

    //used to fetch backend components (JSON files)
    const components = useComponents() || [];

    //used to search for components
    const [searchQuery, setSearchQuery] = useState("");
    //used to collapse down categories of components
    const [collapsed, setCollapsed] = useState({});

    const selectedComponent = placedComponents.find(c => c.id === selectedId);

    const handleDrop = (e) => {
        e.preventDefault();

        const component = e.dataTransfer.getData("component");
        if (!component) {
            return;
        }

        const canvas = canvasRef.current;
        const canvasBorder = canvas.getBoundingClientRect();

        //mouse position relative to canvas
        const x = e.clientX - canvasBorder.left;
        const y = e.clientY - canvasBorder.top;

        //clamp to canvas size
        const compData = components.find(c => c.id === component); // <-- changed from COMPONENT_LIBRARY

        if (!compData) {
            console.warn("Component not found:", component);
            return;
        }

        const compWidth = compData.width || 120;
        const compHeight = compData.height || 160;

        const clampedX = Math.max(0, Math.min(x, canvasBorder.width - compWidth));
        const clampedY = Math.max(0, Math.min(y, canvasBorder.height - compHeight));

        setPlacedComponents(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type: component,
                x: clampedX,
                y: clampedY,
                width: compWidth,
                height: compHeight,
                pins: compData.pins || [], 
                behavior: compData.behavior || null,
                props: { ...compData.defaultProps }
            }
        ]);
    };


    const handlePropertyChange = (id, key, value) => {
        setPlacedComponents(prev =>
            prev.map(c => c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c)
        );
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleMouseMove = (e) => {
        if (!draggingId) {
            return;
        }

        const canvas = canvasRef.current;
        const canvasBorder = canvas.getBoundingClientRect();

        const mouseX = e.clientX - canvasBorder.left;
        const mouseY = e.clientY - canvasBorder.top;

        setPlacedComponents(prev =>
            prev.map(c =>
                c.id === draggingId
                    ? {
                        ...c,
                        x: Math.max(0, Math.min(mouseX - offset.x, canvasBorder.width - c.width)),
                        y: Math.max(0, Math.min(mouseY - offset.y, canvasBorder.height - c.height))
                    }
                    : c
            )
        );
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    const handleDelete = useCallback(() => {
        setPlacedComponents(prev => prev.filter(c => c.id !== selectedId));
        setSelectedId(null);
    }, [selectedId]); 

    // keyboard delete listener
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
        handleDragOver,
        handleMouseMove,
        handleMouseUp,
        handlePropertyChange,
        handleDelete
    };
}
