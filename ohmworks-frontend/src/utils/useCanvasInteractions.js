import { useState, useEffect, useCallback, useRef } from "react";
import { COMPONENT_LIBRARY } from "../data/electronicComponents";

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


    //used to search for components
    const [searchQuery, setSearchQuery] = useState("");
    //used to collapse down categories of components
    const [collapsed, setCollapsed] = useState({});

    const selectedComponent = placedComponents.find(c => c.id === selectedId);
    const handleDrop = (e) => {
        e.preventDefault();
        const component = e.dataTransfer.getData("component");
        if (!component) {
            return
        }
        const canvas = canvasRef.current
        const canvasBorder = canvas.getBoundingClientRect()
        const x = e.clientX - canvasBorder.left;
        const y = e.clientY - canvasBorder.top;

        const clampedX = Math.max(0, Math.min(x, canvasBorder.width - 50))
        const clampedY = Math.max(0, Math.min(y, canvasBorder.height - 20))

        const compData = COMPONENT_LIBRARY.find(c => c.id === component)

        setPlacedComponents(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type: component,
                x: clampedX,
                y: clampedY,
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
            return
        }

        const canvas = canvasRef.current
        const canvasBorder = canvas.getBoundingClientRect()

        const mouseX = e.clientX - canvasBorder.left
        const mouseY = e.clientY - canvasBorder.top

        setPlacedComponents(prev =>
            prev.map(c =>
                c.id === draggingId ? {
                    ...c, x: Math.max(0, Math.min(mouseX - offset.x, canvasBorder.width - 50)),
                    y: Math.max(0, Math.min(mouseY - offset.y, canvasBorder.height - 20))
                } : c
            )
        )
    }
    const handleMouseUp = () => {
        setDraggingId(null);
    };

    //listening for deleting item on canvas
    const handleDelete = useCallback(() => {
        setPlacedComponents(prev => prev.filter(c => c.id !== selectedId));
        setSelectedId(null);
    }, [selectedId]); // depends on selectedId

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