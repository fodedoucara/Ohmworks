import styles from "../pages/Workspace.module.css";

export default function PropertiesPanel({
    selectedComponent,
    selectedWire,
    handlePropertyChange, 
    handleWirePropertyChange,
    handleDelete // Handles both component and wire deletion
}) {
    if (!selectedComponent && !selectedWire) {
        return (
            <div className={styles.panel}>
                <h3>No item selected</h3>
                <p>Select a component or wire on the canvas to edit its properties.</p>
            </div>
        );
    }

    // --- RENDER WIRE PROPERTIES ---
    if (selectedWire) {
        return (
            <div className={styles.panel}>
                <h3>Properties: Wire</h3>

                <div className={styles.row}>
                    <label>Color</label>
                    <input
                        type="color" // Color picker for easy color selection
                        value={selectedWire.color || '#00ff00'}
                        onChange={(e) =>
                            handleWirePropertyChange(selectedWire.id, 'color', e.target.value)
                        }
                    />
                </div>

                <button className={styles.deleteButton} onClick={handleDelete}>
                    Delete Wire
                </button>
            </div>
        );
    }

    // --- RENDER COMPONENT PROPERTIES --- (If selectedComponent exists)
    const { id, templateId } = selectedComponent;


    // --- RENDER LED PROPERTIES ---
    if (templateId === "led") {
    return (
        <div className={styles.panel}>
            <h3>LED Properties</h3>

            <div className={styles.row}>
                <label>Color</label>
                <input
                    type="color"
                    value={selectedComponent.props?.Color || "#00ff00"}
                    onChange={(e) =>
                        handlePropertyChange(id, "Color", e.target.value)
                    }
                />
            </div>

            <button className={styles.deleteButton} onClick={handleDelete}>
                Delete Component
            </button>
        </div>
    );
}

    // --- RENDER DEFAULT PROPERTIES ---
    return (
        <div className={styles.panel}>
            <h3>Properties: {templateId}</h3>

            {Object.entries(selectedComponent.props || {}).map(([key, value]) => (
                <div key={key} className={styles.row}>
                    <label>{key}</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                            handlePropertyChange(id, key, e.target.value)
                        }
                    />
                </div>
            ))}

            <button className={styles.deleteButton} onClick={handleDelete}>
                Delete Component
            </button>
        </div>
    );
}