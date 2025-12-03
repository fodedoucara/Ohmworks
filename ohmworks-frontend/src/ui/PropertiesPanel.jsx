import styles from "../pages/Workspace.module.css";

export default function PropertiesPanel({
    selectedComponent,
    handlePropertyChange,
    handleDelete
}) {
    if (!selectedComponent) {
        return (
            <div className={styles.panel}>
                <h3>No component selected</h3>
                <p>Select a component on the canvas to edit its properties.</p>
            </div>
        );
    }

    const { id, type, props } = selectedComponent;

    return (
        <div className={styles.panel}>
            <h3>Properties: {type}</h3>

            {Object.entries(props).map(([key, value]) => (
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
                Delete
            </button>
        </div>
    );
}
