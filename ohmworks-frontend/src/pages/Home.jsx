import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";


export default function Home() {
    const navigate = useNavigate();

    return (
        <main className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1 className={styles.title}>Ohmworks -The Path of Least Resistance</h1>
                <p className={styles.subtitle}>
                    Build, simulate, and test real-world electronics online — no breadboard required.
                </p>
                <div className={styles.buttons}>
                    <button
                        className={styles.primary}
                        onClick={() => navigate("/workspace")}
                    >
                        Start New Circuit
                    </button>
                    <button
                        className={styles.secondary}
                        onClick={() => alert("Sample projects coming soon!")}
                    >
                        Explore Samples
                    </button>
                </div>
            </section>

            {/* Preview / Placeholder */}
            <section className={styles.preview}>
                <h2>Preview</h2>
                <div className={styles.canvasPlaceholder}>
                    {/* Later we will render CircuitCanvas here */}
                    <p>Your virtual circuit canvas will appear here.</p>
                </div>
            </section>
        </main>
    );
}
