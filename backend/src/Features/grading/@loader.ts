import { type RPC } from "enders-sync";
import { fetchStudentGradeFieldsPerStudying, fetchStudentLabGradesPerStudying } from "./grading.service.js";


export function gradingLoader(rpc: RPC) {
    rpc.add(fetchStudentGradeFieldsPerStudying);
    rpc.add(fetchStudentLabGradesPerStudying);
}