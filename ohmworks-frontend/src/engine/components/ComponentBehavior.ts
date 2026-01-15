import {Netlist} from "../netlist/Netlist"
import {Constraint} from "../solver/Constraint"



 // Base behavior for all components
 
export interface ComponentBehavior{
    readonly compId: string;
    readonly compType: string;
    readonly pinIds: readonly string[];

    //Promise that every componentBehavior must keep. 
    //It adds the components contribution to the overall system of equations.
    stamp(netlist: Netlist): Constraint[];


    validate(netlist: Netlist) : string[];
}
