import { type RPC } from "enders-sync";
import {
    deleteEnrollment,
    fetchEnrollmentsForSubject,
    fetchSingleEnrollment,
    newEnrollment,
    updateEnrollment,
} from "./studying.service.js";

export function studyingLoader(rpc: RPC) {
    rpc.add(newEnrollment);
    rpc.add(updateEnrollment);
    rpc.add(deleteEnrollment);
    rpc.add(fetchSingleEnrollment);
    rpc.add(fetchEnrollmentsForSubject);
}
