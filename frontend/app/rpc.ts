import { RPC } from "enders-sync-client";



interface Loggedin {
    user_id: string;
    role: string;
}

interface PublicRPC {
    load(): Promise<void>;
    login(username: string, password: string): Promise<Loggedin>;
    logout(): Promise<void>;
}

export interface teacherData {
    id?: number;
    name: string;
    password?: string;
}

export interface studentData {
    id?: number;
    name: string;
    year_joined: number;
    degree: string;
    class: number;
    years_retaken: number;
    years_failed: number;
}

export interface SubjectData {
    id?: number;
    name: string;
    degree: string;
    class: number;
    total_hours: number;
    hours_weekly: number;
    is_attending_required: boolean;
    teacher_name: string;
    teacher?: string;
}

export interface EnrollmentData {
    id?: number;
    teacher_id?: number;
    teacher_name?: string;
    student_id?: number;
    student_name?: string;
    subject_id?: number;
    subject_name?: string;
    exam_retakes?: number;
    semester_retakes?: number;
    studying_year?: number;
    hours_missed?: number;
    coursework_grade_percent?: number;
    finals_grade_percent?: number;
}

export interface AttendanceRecordData {
    id: number;
    date: string;
    created_at: string;
}

export interface AbsentedData {
    id?: number;
    hours_absent?: number;
    student_name?: string;
}

export interface GradesDate {
    id?: number;
    coursework_grade?: number;
    teacher_name?: string;
    student_name?: string;
}

export interface SubjectAccessControlData {
    id?: number;
    subject_id?: number;
    loggedin_user?: number;
    subject_name?: string;
    user_name?: string;
}

interface AdminsRPC {
    load(): Promise<void>;

    login(username: string, password: string): Promise<Loggedin>;
    registerTeacher(data: teacherData): Promise<number>;

    // teachers accounts management
    updateUser(id: string, data: teacherData): Promise<number>;
    deleteUser(id: number): Promise<void>;
    changeSelfPassword(password: string): Promise<void>;
    changeTeacherPassword(id: string, password: string): Promise<void>;
    fetchTeachers(): Promise<teacherData[]>;
    autocompleteTeacher(name: string): Promise<string[]>;

    // students registration management
    fetchStudents(): Promise<studentData[]>;
    updateStudent(uid: number, data: any): Promise<{ id: number }>;
    newStudent(data: studentData): Promise<{ id: number }>;
    deleteStudent(student_id: number): Promise<void>;
    fetchStudentInfo(id: number): Promise<studentData>;
    filterStudentsByClassDegree(degree: string, student_class: number): Promise<studentData[]>;
    filterStudentsByDegree(degree: string): Promise<studentData[]>;
    autocompleteStudent(name: string): Promise<string[]>;
    findStudentByName(name: string): Promise<studentData>;

    // subjects tracking
    newSubject(data: SubjectData): Promise<number>;
    updateSubject(id: number, data: Partial<SubjectData>): Promise<number>;
    deleteSubject(id: number): Promise<void>;
    fetchSingleSubject(id: number): Promise<SubjectData>;
    fetchSubjects(): Promise<SubjectData[]>;
    filterSubjectsByClassDegree(degree: string, student_class: number): Promise<SubjectData[]>;
    filterSubjectsByDegree(degree: string): Promise<SubjectData[]>;
    autocompleteSubject(name: string): Promise<string[]>;
    findSubjectByName(name: string): Promise<SubjectData[]>;

    // students "studying" relationship management
    newEnrollment(data: EnrollmentData): Promise<number>;
    updateEnrollment(id: number, data: Partial<EnrollmentData>): Promise<number>;
    deleteEnrollment(id: number): Promise<void>;
    fetchSingleEnrollment(id: number): Promise<EnrollmentData>;
    fetchEnrollmentsForSubject(subject_id: number): Promise<EnrollmentData[]>;

    // attendance management per record
    markStudentAbsent(data: { attendance_record_id: number, hours_absent: number }): Promise<void>;
    deleteAttendanceRecordForTheDay(attendance_record_id: number): Promise<void>;

    // attendance records management
    createDailyAttendanceRecord(subject_id: number, date: string): Promise<number>;
    fetchDailyAttendanceRecordsForTheSubject(subject_id: number): Promise<AttendanceRecordData[]>;

    // attendance management per student
    markStudentAbsent(data: { attendance_record_id: number, student_name: string, hours_absent: number }): Promise<void>;
    fetchAbsentStudents(attendance_record_id: number): Promise<AbsentedData[]>;
    removeAbsence(absented_id: number): Promise<void>;

    // grading
    fetchStudentCourseworkGradesPerStudying(studying_id: number): Promise<GradesDate[]>;

    // TA access control
    fetchSubjectAccessControl(subject_id: number): Promise<SubjectAccessControlData[]>;
    grantAccess(subject_name: string, user_name: string): Promise<void>;
    revokeAccess(subject_id: number, user_id: number): Promise<void>;
}

interface TeachersRPC {
    load(): Promise<void>;

    logout(): Promise<void>;
    login(username: string, password: string): Promise<Loggedin>;
    registerTeacher(data: teacherData): Promise<number>;

    // teachers accounts management
    updateUser(id: string, data: teacherData): Promise<number>;
    deleteUser(id: number): Promise<void>;
    changeSelfPassword(password: string): Promise<void>;
    changeTeacherPassword(id: string, password: string): Promise<void>;
    fetchTeachers(): Promise<teacherData[]>;
    autocompleteTeacher(name: string): Promise<string[]>;

    // students registration management
    fetchStudents(): Promise<studentData[]>;
    updateStudent(uid: number, data: any): Promise<{ id: number }>;
    newStudent(data: studentData): Promise<{ id: number }>;
    deleteStudent(student_id: number): Promise<void>;
    fetchStudentInfo(id: number): Promise<studentData>;
    filterStudentsByClassDegree(degree: string, student_class: number): Promise<studentData[]>;
    filterStudentsByDegree(degree: string): Promise<studentData[]>;
    autocompleteStudent(name: string): Promise<string[]>;
    findStudentByName(name: string): Promise<studentData>;

    // subjects tracking
    newSubject(data: SubjectData): Promise<number>;
    updateSubject(id: number, data: Partial<SubjectData>): Promise<number>;
    deleteSubject(id: number): Promise<void>;
    fetchSingleSubject(id: number): Promise<SubjectData>;
    fetchSubjects(): Promise<SubjectData[]>;
    filterSubjectsByClassDegree(degree: string, student_class: number): Promise<SubjectData[]>;
    filterSubjectsByDegree(degree: string): Promise<SubjectData[]>;
    autocompleteSubject(name: string): Promise<string[]>;
    findSubjectByName(name: string): Promise<SubjectData[]>;

    // TA subject tracking
    fetch_ta_subject_list(degree: string, subject_class?: number): Promise<SubjectData[]>;

    // students "studying" relationship management
    newEnrollment(data: EnrollmentData): Promise<number>;
    updateEnrollment(id: number, data: Partial<EnrollmentData>): Promise<number>;
    deleteEnrollment(id: number): Promise<void>;
    fetchSingleEnrollment(id: number): Promise<EnrollmentData>;
    fetchEnrollmentsForSubject(subject_id: number): Promise<EnrollmentData[]>;

    // attendance management per record
    markStudentAbsent(data: { attendance_record_id: number, hours_absent: number }): Promise<void>;
    deleteAttendanceRecordForTheDay(attendance_record_id: number): Promise<void>;

    // attendance records management
    createDailyAttendanceRecord(subject_id: number, date: string): Promise<number>;
    fetchDailyAttendanceRecordsForTheSubject(subject_id: number): Promise<AttendanceRecordData[]>;

    // attendance management per student
    markStudentAbsent(data: { attendance_record_id: number, student_name: string, hours_absent: number }): Promise<void>;
    fetchAbsentStudents(attendance_record_id: number): Promise<AbsentedData[]>;
    removeAbsence(absented_id: number): Promise<void>;

    // grading
    fetchStudentCourseworkGradesPerStudying(studying_id: number): Promise<GradesDate[]>;

    fetchSubjectsByTeacher(degree: string, subject_class?: number): Promise<SubjectData[]>;
}


interface SuperAdminRPC {
    load(): Promise<void>;

    login(username: string, password: string): Promise<Loggedin>;
    registerTeacher(data: teacherData): Promise<number>;

    // teachers accounts management
    updateUser(id: string, data: teacherData): Promise<number>;
    deleteUser(id: number): Promise<void>;
    changeSelfPassword(password: string): Promise<void>;
    changeTeacherPassword(id: string, password: string): Promise<void>;
    fetchTeachers(): Promise<teacherData[]>;
    autocompleteTeacher(name: string): Promise<string[]>;

    // students registration management
    fetchStudents(): Promise<studentData[]>;
    updateStudent(uid: number, data: any): Promise<{ id: number }>;
    newStudent(data: studentData): Promise<{ id: number }>;
    deleteStudent(student_id: number): Promise<void>;
    fetchStudentInfo(id: number): Promise<studentData>;
    filterStudentsByClassDegree(degree: string, student_class: number): Promise<studentData[]>;
    filterStudentsByDegree(degree: string): Promise<studentData[]>;
    autocompleteStudent(name: string): Promise<string[]>;
    findStudentByName(name: string): Promise<studentData>;

    // subjects tracking
    newSubject(data: SubjectData): Promise<number>;
    updateSubject(id: number, data: Partial<SubjectData>): Promise<number>;
    deleteSubject(id: number): Promise<void>;
    fetchSingleSubject(id: number): Promise<SubjectData>;
    fetchSubjects(): Promise<SubjectData[]>;
    filterSubjectsByClassDegree(degree: string, student_class: number): Promise<SubjectData[]>;
    filterSubjectsByDegree(degree: string): Promise<SubjectData[]>;
    autocompleteSubject(name: string): Promise<string[]>;
    findSubjectByName(name: string): Promise<SubjectData[]>;

    // students "studying" relationship management
    newEnrollment(data: EnrollmentData): Promise<number>;
    updateEnrollment(id: number, data: Partial<EnrollmentData>): Promise<number>;
    deleteEnrollment(id: number): Promise<void>;
    fetchSingleEnrollment(id: number): Promise<EnrollmentData>;
    fetchEnrollmentsForSubject(subject_id: number): Promise<EnrollmentData[]>;

    // attendance management per record
    markStudentAbsent(data: { attendance_record_id: number, hours_absent: number }): Promise<void>;
    deleteAttendanceRecordForTheDay(attendance_record_id: number): Promise<void>;

    // attendance records management
    createDailyAttendanceRecord(subject_id: number, date: string): Promise<number>;
    fetchDailyAttendanceRecordsForTheSubject(subject_id: number): Promise<AttendanceRecordData[]>;

    // attendance management per student
    markStudentAbsent(data: { attendance_record_id: number, student_name: string, hours_absent: number }): Promise<void>;
    fetchAbsentStudents(attendance_record_id: number): Promise<AbsentedData[]>;
    removeAbsence(absented_id: number): Promise<void>;

    // grading
    fetchStudentCourseworkGradesPerStudying(studying_id: number): Promise<GradesDate[]>;

    // TA access control
    fetchSubjectAccessControl(subject_id: number): Promise<SubjectAccessControlData[]>;
    grantAccess(subject_name: string, user_name: string): Promise<void>;
    revokeAccess(subject_id: number, user_id: number): Promise<void>;

    // teacher
    logout(): Promise<void>;

    // TA subject tracking
    fetch_ta_subject_list(degree: string, subject_class?: number): Promise<SubjectData[]>;


    fetchSubjectsByTeacher(degree: string, subject_class?: number): Promise<SubjectData[]>;
};


export const publicRPC = new RPC('/api/public') as unknown as PublicRPC;
export const adminRPC = new RPC('/api/admin') as unknown as AdminsRPC;


export const superAdminRPC = new RPC('/api/superadmin') as unknown as SuperAdminRPC;
export const teacherRPC = new RPC('/api/teacher') as unknown as TeachersRPC;

export async function initializeRPC() {
  await publicRPC.load();
  await adminRPC.load();
  await superAdminRPC.load();
  await teacherRPC.load();
}

await initializeRPC()
