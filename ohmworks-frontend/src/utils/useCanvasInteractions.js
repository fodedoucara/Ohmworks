import { useState, useEffect, useCallback, useRef } from "react";
import useComponents from "./useComponents";

export function useCanvasInteractions() {
    const blockDragRef = useRef(false);
    const [wires, setWires] = useState([]); 
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
    const selectedWire = wires.find(w => w.id === selectedId); 

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
       PROPERTY CHANGE HANDLERS
    ============================================================ */
    const handlePropertyChange = (id, key, value) => {
        setPlacedComponents(prev =>
            prev.map(c => {
                if (c.id !== id) return c;

                const newProps = { ...c.props, [key]: value };

      // If LED, ensure props exist for CSS variable usage
                if (c.templateId === "led" && key === "Color") {
                    return { ...c, props: newProps };
                }

      // Default update for other properties
                return { ...c, props: newProps };
    })
  );
};
    const handleWirePropertyChange = useCallback((id, key, value) => {
        setWires(prev =>
            prev.map(w =>
                w.id === id ? { ...w, [key]: value } : w
            )
        );
    }, []);

    /* ============================================================
       DELETE HANDLER (Modified to handle both components and wires)
    ============================================================ */
    const handleDelete = useCallback(() => {
        const componentIdToDelete = selectedId;
        
        if (selectedComponent) {
            // Delete component and associated wires
            setPlacedComponents(prev => prev.filter(c => c.id !== componentIdToDelete));
            setWires(prev => prev.filter(w => 
                w.from.componentId !== componentIdToDelete && w.to.componentId !== componentIdToDelete
            ));
        } else if (selectedWire) {
            // Delete selected wire
            setWires(prev => prev.filter(w => w.id !== selectedId));
        }

        setSelectedId(null);
    }, [selectedId, selectedComponent, selectedWire]);

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
        // handleDelete dependency to ensure the correct deletion logic (component vs. wire) is used
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
        selectedWire,
        searchQuery,
        setSearchQuery,
        collapsed,
        setCollapsed,
        handleDrop,
        handleDragOver: e => e.preventDefault(),
        handleMouseMove,
        handleMouseUp,
        handlePropertyChange,
        handleWirePropertyChange,
        handleDelete,
        blockDragRef,
        selectedPin,
        setSelectedPin,
        pinLayout,
        onPinLayout,
        wires,
        setWires
    };
}