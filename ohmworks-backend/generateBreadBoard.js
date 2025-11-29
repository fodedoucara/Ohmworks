import fs from "fs";

const rows = 30;
const leftCols = ["A", "B", "C", "D", "E"];
const rightCols = ["F", "G", "H", "I", "J"];

const pins = [];

/* === Power Rails === */
for (let i = 0; i < 4; i++) {
  pins.push(
    { id: `TRP${i}`, label: "+", side: "top", rail: "power+", index: i },
    { id: `TRG${i}`, label: "-", side: "top", rail: "ground-", index: i }
  );
}

/* === Holes A1–J30 === */
for (let row = 1; row <= rows; row++) {
  // Left block A–E
  leftCols.forEach((col, idx) => {
    pins.push({
      id: `${col}${row}`,
      label: `${col}${row}`,
      group: `row-left-${row}`,
      side: "internal",
      row,
      col,
      index: idx
    });
  });

  // Right block F–J
  rightCols.forEach((col, idx) => {
    pins.push({
      id: `${col}${row}`,
      label: `${col}${row}`,
      group: `row-right-${row}`,
      side: "internal",
      row,
      col,
      index: idx
    });
  });
}

const result = {
  id: "breadboard_small",
  name: "Breadboard Small",
  category: "Boards",
  width: 400,
  height: 300,
  pins
};

fs.writeFileSync("./components/data/breadboard_small.json", JSON.stringify(result, null, 2));
console.log("Breadboard generated!");
