import { type RPC } from "enders-sync";
import { markStudentAbsent, markStudentAbsentBulk, fetchAbsentStudents, removeAbsence, updateAbsence } from "./absented.service.js";


export function absentedLoader(rpc: RPC) {
    rpc.add(removeAbsence);
    rpc.add(updateAbsence);
    rpc.add(markStudentAbsent);
    rpc.add(markStudentAbsentBulk);
    rpc.add(fetchAbsentStudents);
}