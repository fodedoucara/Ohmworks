import fs from "fs";

const rows = 30;
const leftCols = ["A", "B", "C", "D", "E"];
const rightCols = ["F", "G", "H", "I", "J"];

const pins = [];

/* === Power Rails === */
for (let i = 0; i < 10; i++) {
  pins.push(
    { id: `TRP${i}`, label: "+", side: "top", rail: "power+", index: i },
    { id: `TRG${i}`, label: "-", side: "top", rail: "ground-", index: i },
    { id: `BRP${i}`, label: "+", side: "bottom", rail: "power+", index: i },
    { id: `BRG${i}`, label: "-", side: "bottom", rail: "ground-", index: i }
  );
}

/* === Holes A1–J30 === */
for (let row = 1; row <= rows; row++) {
  leftCols.forEach((col, idx) => {
    pins.push({
      id: `${col}${row}`,
      label: `${col}${row}`,
      side: "internal",
      row,
      col,
      index: idx,
      group: `row-left-${row}`
    });
  });

  rightCols.forEach((col, idx) => {
    pins.push({
      id: `${col}${row}`,
      label: `${col}${row}`,
      side: "internal", 
      row,
      col,
      index: idx + 5,
      group: `row-right-${row}`
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
