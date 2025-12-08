import styles from "../pages/Workspace.module.css";
import { RESISTOR_BAND_OPTIONS } from "../utils/resistorBands";

// Helper function to get readable text color based on background
function getTextColor(hexColor) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128 ? "#FFFFFF" : "#000000";
}

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

    // --- RENDER RESISTOR PROPERTIES ---
    if (templateId === "resistor") {
    const bands = ["Band1", "Band2", "Multiplier", "Tolerance"];

    return (
      <div className={styles.panel}>
        <h3>Resistor Properties</h3>

        {bands.map((bandKey, idx) => {
          const options = RESISTOR_BAND_OPTIONS[["band1", "band2", "band3", "band4"][idx]];
          const selectedValue = selectedComponent.props?.[bandKey] || options[0].value;

          return (
            <div className={styles.row} key={bandKey}>
              <label>{bandKey}</label>
              <select
                value={selectedValue}
                onChange={(e) =>
                  handlePropertyChange(selectedComponent.id, bandKey, e.target.value)
                }
                style={{
                  backgroundColor: options.find(opt => opt.value === selectedValue)?.color || "#fff",
                  color: getTextColor(options.find(opt => opt.value === selectedValue)?.color || "#fff")
                }}
              >
                {options.map(opt => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    style={{
                      backgroundColor: opt.color,
                      color: getTextColor(opt.color)
                    }}
                  >
                    {opt.label} ({opt.value})
                  </option>
                ))}
              </select>
            </div>
          );
        })}

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