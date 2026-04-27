import { type RPC } from "enders-sync";
import { fetchStudentGradeFieldsPerStudying } from "./grading.service.js";


export function gradingLoader(rpc: RPC) {
    rpc.add(fetchStudentGradeFieldsPerStudying);
}