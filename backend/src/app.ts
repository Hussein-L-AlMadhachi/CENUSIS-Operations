import express, { type Request, type Response } from 'express';
import { createRPC } from 'enders-sync';
import cookieParser from "cookie-parser";
import { login, auth, logout } from './auth.js';
import {
    fetchTeachers, changeSelfPassword, changeTeacherPassword, deleteUser,
    getProfile, registerAdmin, registerTeacher, updateUser,
    updateSelf,
    autocompleteTeacher
} from './services/teaching_staff.js';
import {
    autocompleteStudent, deleteStudent, fetchStudentInfo,
    filterStudentsByClassDegree, filterStudentsByDegree,
    findStudentByName, newStudent, updateStudent
} from './services/students.js';
import {
    autocompleteSubject, deleteSubject, fetchSingleSubject, fetchSubjects,
    fetchSubjectsByTeacher,
    filterSubjectsByClassDegree, filterSubjectsByDegree, findSubjectByName, newSubject, updateSubject
} from './services/subjects.js';
import {
    deleteEnrollment, fetchCourseworkGradesWithDataForSubject, fetchEnrollmentsForSubject, fetchSingleEnrollment,
    newEnrollment, updateEnrollment
} from './services/studying.js';
import {
    fetchAbsentStudents, markStudentAbsent, removeAbsence
} from './services/absented.js';
import {
    createDailyAttendanceRecord, fetchDailyAttendanceRecordsForTheSubject
} from './services/attendance_record.js';
import { fetchStudentCourseworkGradesPerStudying } from './services/grading.js';
import {
    fetch_ta_subject_list,
    fetchSubjectAccessControl, grantAccess, revokeAccess
} from './services/subjects_access_control.js';







export const app = express();
app.use(cookieParser());
app.use(express.json());







// Create a public RPC instance (no authentication required)
export const publicRPC = createRPC(app, '/api/public', () => ({
    success: true
}));

publicRPC.add(login);
publicRPC.add(logout);







// Create a admin RPC instance
export const adminRPC = createRPC(app, '/api/admin', auth.admin);



// teachers account profiles RPC
adminRPC.add(fetchTeachers);
adminRPC.add(registerTeacher);
adminRPC.add(registerAdmin);
adminRPC.add(deleteUser);
adminRPC.add(updateUser);
adminRPC.add(getProfile);
adminRPC.add(changeTeacherPassword);
adminRPC.add(autocompleteTeacher);

// students RPC
adminRPC.add(newStudent);
adminRPC.add(updateStudent);
adminRPC.add(deleteStudent);
adminRPC.add(fetchStudentInfo);
adminRPC.add(filterStudentsByClassDegree);
adminRPC.add(filterStudentsByDegree);
adminRPC.add(autocompleteStudent);
adminRPC.add(findStudentByName);

// subjects RPC
adminRPC.add(newSubject);
adminRPC.add(updateSubject);
adminRPC.add(deleteSubject);
adminRPC.add(fetchSingleSubject);
adminRPC.add(fetchSubjects);
adminRPC.add(filterSubjectsByClassDegree);
adminRPC.add(filterSubjectsByDegree);
adminRPC.add(autocompleteSubject);
adminRPC.add(findSubjectByName);

// enrollments RPC
adminRPC.add(newEnrollment);
adminRPC.add(updateEnrollment);
adminRPC.add(deleteEnrollment);
adminRPC.add(fetchSingleEnrollment);
adminRPC.add(fetchEnrollmentsForSubject);

//subjects access control
adminRPC.add(fetchSubjectAccessControl);
adminRPC.add(revokeAccess);
adminRPC.add(grantAccess);







// Create a super admin RPC instance
export const superRPC = createRPC(app, '/api/superadmin', auth.superadmin);



// teachers account profiles RPC
superRPC.add(fetchTeachers);
superRPC.add(registerTeacher);
superRPC.add(registerAdmin);
superRPC.add(deleteUser);
superRPC.add(updateUser);
superRPC.add(getProfile);
superRPC.add(changeTeacherPassword);
superRPC.add(autocompleteTeacher);

// students RPC
superRPC.add(newStudent);
superRPC.add(updateStudent);
superRPC.add(deleteStudent);
superRPC.add(fetchStudentInfo);
superRPC.add(filterStudentsByClassDegree);
superRPC.add(filterStudentsByDegree);
superRPC.add(autocompleteStudent);
superRPC.add(findStudentByName);

// subjects RPC
superRPC.add(newSubject);
superRPC.add(updateSubject);
superRPC.add(deleteSubject);
superRPC.add(fetchSingleSubject);
superRPC.add(fetchSubjects);
superRPC.add(filterSubjectsByClassDegree);
superRPC.add(filterSubjectsByDegree);
superRPC.add(autocompleteSubject);
superRPC.add(findSubjectByName);

// enrollments RPC
superRPC.add(newEnrollment);
superRPC.add(updateEnrollment);
superRPC.add(deleteEnrollment);
superRPC.add(fetchSingleEnrollment);
superRPC.add(fetchEnrollmentsForSubject);

// attendance RPC
superRPC.add(fetchDailyAttendanceRecordsForTheSubject);
superRPC.add(createDailyAttendanceRecord);
superRPC.add(markStudentAbsent);

// absented RPC
superRPC.add(removeAbsence);
superRPC.add(markStudentAbsent);
superRPC.add(fetchAbsentStudents);

// grading
superRPC.add(fetchStudentCourseworkGradesPerStudying)

//subjects access control
superRPC.add(fetchSubjectAccessControl);
superRPC.add(revokeAccess);
superRPC.add(grantAccess);

// own account management
superRPC.add(changeSelfPassword);
superRPC.add(logout);

// CRITICAL enrollment with grades view
superRPC.add(fetchCourseworkGradesWithDataForSubject);







// Create a teachers RPC instance
export const teachersRPC = createRPC(app, '/api/teacher', auth.teacher);



// teachers account profiles RPC
teachersRPC.add(fetchTeachers);
teachersRPC.add(registerTeacher);
teachersRPC.add(registerAdmin);
teachersRPC.add(deleteUser);
teachersRPC.add(updateUser);
teachersRPC.add(getProfile);
teachersRPC.add(changeTeacherPassword);
teachersRPC.add(autocompleteTeacher);

// students RPC
teachersRPC.add(newStudent);
teachersRPC.add(updateStudent);
teachersRPC.add(deleteStudent);
teachersRPC.add(fetchStudentInfo);
teachersRPC.add(filterStudentsByClassDegree);
teachersRPC.add(filterStudentsByDegree);
teachersRPC.add(autocompleteStudent);
teachersRPC.add(findStudentByName);

// subjects RPC
teachersRPC.add(newSubject);
teachersRPC.add(updateSubject);
teachersRPC.add(deleteSubject);
teachersRPC.add(fetchSingleSubject);
teachersRPC.add(fetchSubjects);
teachersRPC.add(filterSubjectsByClassDegree);
teachersRPC.add(filterSubjectsByDegree);
teachersRPC.add(autocompleteSubject);
teachersRPC.add(findSubjectByName);

// enrollments RPC
teachersRPC.add(newEnrollment);
teachersRPC.add(updateEnrollment);
teachersRPC.add(deleteEnrollment);
teachersRPC.add(fetchSingleEnrollment);
teachersRPC.add(fetchEnrollmentsForSubject);

// attendance RPC
teachersRPC.add(fetchDailyAttendanceRecordsForTheSubject);
teachersRPC.add(createDailyAttendanceRecord);
teachersRPC.add(markStudentAbsent);

// absented RPC
teachersRPC.add(removeAbsence);
teachersRPC.add(markStudentAbsent);
teachersRPC.add(fetchAbsentStudents);

// grading
teachersRPC.add(fetchStudentCourseworkGradesPerStudying)

//subjects access control
teachersRPC.add(fetchSubjectAccessControl);
teachersRPC.add(revokeAccess);
teachersRPC.add(grantAccess);

//ta subjects list
teachersRPC.add(fetch_ta_subject_list);

// own account management
teachersRPC.add(logout);


// subjects assigned to teacher
teachersRPC.add(fetchSubjectsByTeacher);







import { studentsXlsxRouter } from "./routes/students_xlsx.js";
app.use(studentsXlsxRouter);

