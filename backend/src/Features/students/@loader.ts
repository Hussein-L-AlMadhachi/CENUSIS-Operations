import { type RPC } from "enders-sync";
import {
    autocompleteStudent,
    deleteStudent,
    fetchStudentInfo,
    filterStudentsByClassDegree,
    filterStudentsByDegree,
    findStudentByName,
    newStudent,
    updateStudent,
} from "./students.service.js";

export function studentsLoader(rpc: RPC) {
    rpc.add(newStudent);
    rpc.add(updateStudent);
    rpc.add(deleteStudent);
    rpc.add(fetchStudentInfo);
    rpc.add(filterStudentsByClassDegree);
    rpc.add(filterStudentsByDegree);
    rpc.add(autocompleteStudent);
    rpc.add(findStudentByName);
}
