import { Netlist } from "../netlist/Netlist";

// Connect 2 pins electrically that are connected by a wire
export function applyWires(
    netlist: Netlist,
    wires: Array<{
        from: { componentID: string; pinID: string };
        to: { componentID: string; pinID: string };
    }>
) {
    for (const wire of wires) {
        netlist.connectPins(wire.from, wire.to)
    }
}