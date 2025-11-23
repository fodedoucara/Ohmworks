import styles from "../pages/Workspace.module.css" 

export default function Sidebar({
    groupedComponents,
    searchQuery,
    setSearchQuery,
    collapsed,
    setCollapsed
}) {
    return (
        <aside className={styles.sidebar}>
            <h2>Components</h2>

            <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />

            <div className={styles.sidebarContent}>
                {Object.entries(groupedComponents).map(([category, comps]) => {
                    // Filter components when searching
                    const filtered = comps.filter(c =>
                        c.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    if (filtered.length === 0) return null;

                    return (
                        <div key={category} className={styles.categoryGroup}>
                            <div
                                className={styles.categoryHeader}
                                onClick={() =>
                                    setCollapsed(prev => ({ ...prev, [category]: !prev[category] }))
                                }
                            >
                                <h3>{category}</h3>
                                <span>{collapsed[category] ? "▸" : "▾"}</span>
                            </div>

                            {!collapsed[category] && (
                                <ul>
                                    {filtered.map((comp) => (
                                        <li
                                            key={comp.id}
                                            draggable
                                            onDragStart={(e) =>
                                                e.dataTransfer.setData("component", comp.id)
                                            }
                                        >
                                            {comp.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
