import fs from "fs";

const COLS = 30;
const TOP_ROWS = ["a", "b", "c", "d", "e"];
const BOT_ROWS = ["f", "g", "h", "i", "j"];

function innerPins() {
    const pins = {};
    const groups = {};

    for (let col = 1; col <= COLS; col++) {
        const topGroup = `col${col}_top`;
        const bottomGroup = `col${col}_bottom`;

        groups[topGroup] = [];
        groups[bottomGroup] = [];

        // Top rows a–e
        TOP_ROWS.forEach(row => {
            const id = `${row}${col}`;
            pins[id] = { group: topGroup };
            groups[topGroup].push(id);
        });

        // Bottom rows f–j
        BOT_ROWS.forEach(row => {
            const id = `${row}${col}`;
            pins[id] = { group: bottomGroup };
            groups[bottomGroup].push(id);
        });
    }

    return { pins, groups };
}

// -----------------------------------------------
// RAILS
// -----------------------------------------------
function railPins(prefix) {
    const pins = {};
    const groups = {};

    // 5 groups × 5 pins = 25 pins per rail
    for (let seg = 1; seg <= 5; seg++) {
        const groupName = `${prefix}_seg${seg}`;
        groups[groupName] = [];

        const start = (seg - 1) * 5 + 1;
        const end = start + 4;

        for (let i = start; i <= end; i++) {
            const id = `${prefix}_${i}`;
            pins[id] = { group: groupName };
            groups[groupName].push(id);
        }
    }

    return { pins, groups };
}

// -----------------------------------------------
// BUILD FINAL JSON
// -----------------------------------------------

const out = {
    id: "breadboard_mini",
    name: "Mini Breadboard",
    category: "Boards",
    svg: "/ohmworks-frontend/src/svg-icons/breadboard_mini.svg",
    pins: {},
    groups: {}
};

// Inner block pins
let inner = innerPins();
Object.assign(out.pins, inner.pins);
Object.assign(out.groups, inner.groups);

// Rails
let rails = [
    "rail_top_pos",
    "rail_top_neg",
    "rail_bottom_pos",
    "rail_bottom_neg"
];

rails.forEach(prefix => {
    const result = railPins(prefix);
    Object.assign(out.pins, result.pins);
    Object.assign(out.groups, result.groups);
});

// Write JSON
fs.writeFileSync("breadboard_mini.json", JSON.stringify(out, null, 2));
console.log("breadboard_mini.json generated!");
