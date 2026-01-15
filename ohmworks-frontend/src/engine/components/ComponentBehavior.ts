import {Netlist} from "../netlist/Netlist"
import {Constraint} from "../solver/Constraint"



 // Base behavior for all components
 
export interface ComponentBehavior{
    readonly id: string; //Component ID
    readonly type: string; //Component Type
    readonly pins: readonly string[]; //Pin IDs

    //Promise that every componentBehavior must keep. 
    //It adds the components contribution to the overall system of equations.
    stamp(netlist: Netlist): Constraint[];


    validate(netlist: Netlist) : string[];
}
