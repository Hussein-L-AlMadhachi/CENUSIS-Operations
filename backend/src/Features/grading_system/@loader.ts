import { type RPC } from "enders-sync";
import {
    autocompleteGradingSystem,
    deleteGradingSystem,
    fetchGradingSystems,
    fetchSingleGradingSystem,
    findGradingSystemByName,
    newGradingSystem,
    updateGradingSystem,
} from "./grading_systems.service.js";

export function gradingSystemsLoader(rpc: RPC) {
    rpc.add(newGradingSystem);
    rpc.add(updateGradingSystem);
    rpc.add(deleteGradingSystem);
    rpc.add(fetchSingleGradingSystem);
    rpc.add(fetchGradingSystems);
    rpc.add(autocompleteGradingSystem);
    rpc.add(findGradingSystemByName);
}
