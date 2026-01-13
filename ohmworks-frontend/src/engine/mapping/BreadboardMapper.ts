import { Netlist } from "../netlist/Netlist";

export function applyBreadboard(
    netlist: Netlist,
    breadboardID: string,
    config: {
        rows: number;
        cols: number;
        railSegments: number;
        railPinsPerSegment: number;
    }
) {
    // Go through breadboard matrix and connect every pin in a row to the leftmost pin
    for (let row = 0; row < config.rows; row++) {
        for (let col = 1; col < config.cols; col++) {
            netlist.connectPins(
                { componentID: breadboardID, pinID: `row_${row}_col_0` },
                { componentID: breadboardID, pinID: `row_${row}_col_${col}` }
            );
        }
    }

    // Go through breadboard rails and connect every pin in a row to the leftmost pin
    for (let segment = 0; segment < config.railSegments; segment++) {
        for (let pin = 1; pin < config.railPinsPerSegment; pin++) {
            netlist.connectPins(
                { componentID: breadboardID, pinID: `rail${segment}_pin_0` },
                { componentID: breadboardID, pinID: `rail${segment}_pin_${pin}` }
            );
        }
    }
}