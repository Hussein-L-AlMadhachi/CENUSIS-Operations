import { type RPC } from "enders-sync";
import {
    autocompleteSubject,
    deleteSubject,
    fetchSingleSubject,
    fetchSubjects,
    fetchSubjectsByTeacher,
    filterSubjectsByClassDegree,
    filterSubjectsByDegree,
    findSubjectByName,
    newSubject,
    updateSubject,
} from "./subjects.service.js";

export function subjectsLoader(rpc: RPC) {
    rpc.add(newSubject);
    rpc.add(updateSubject);
    rpc.add(deleteSubject);
    rpc.add(fetchSingleSubject);
    rpc.add(fetchSubjects);
    rpc.add(filterSubjectsByClassDegree);
    rpc.add(filterSubjectsByDegree);
    rpc.add(autocompleteSubject);
    rpc.add(findSubjectByName);
    rpc.add(fetchSubjectsByTeacher);
}
