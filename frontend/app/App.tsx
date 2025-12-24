import { Route, Switch } from "wouter";
import type { JSX } from "react";



import { TeachersPage } from "@/pages/admin/Teachers";
import { LoginPage } from "@/pages/LoginPage";
import { StudentsPage } from "@/pages/admin/Students";
import { SubjectsPage } from "@/pages/admin/Subjects";

import { StudyingPage } from "@/pages/admin/Studying";
import { AttendancePage } from "@/pages/admin/Attendance";
import { AbsentedPage } from "@/pages/admin/Absented";

import { PermissionsPage } from "@/pages/admin/Permissions";
import { TeachersSubjectsPage } from "./pages/teacher/Subjects";
import { TeachersAttendancePage } from "./pages/teacher/Attendance";
import { TeachersAbsentedPage } from "./pages/teacher/Absented";
import { TeachersGradesPage } from "./pages/teacher/Grades";
import { TeacherStudyingPage } from "./pages/teacher/Studying";
import { GradesPage } from "./pages/admin/Grades";
import { TA_SubjectsPage } from "./pages/teacher/TA_Subjects";



export default function App(): JSX.Element {
    return <>
        <Switch>
            <Route path="/" component={LoginPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/admin/teachers" component={TeachersPage} />
            <Route path="/admin/students" component={StudentsPage} />
            <Route path="/admin/subjects" component={SubjectsPage} />
            <Route path="/admin/enrolled/:teacher/:id" component={StudyingPage} />
            <Route path="/admin/attendance/:subject_id" component={AttendancePage} />
            <Route path="/admin/absented/:attendance_record" component={AbsentedPage} />
            <Route path="/admin/permissions/:subject_id" component={PermissionsPage} />
            <Route path="/admin/grades/:studying_id" component={GradesPage} />

            <Route path="/teacher/subjects" component={TeachersSubjectsPage} />
            <Route path="/teacher/ta_subjects" component={TA_SubjectsPage} />
            <Route path="/teacher/attendance/:subject_id" component={TeachersAttendancePage} />
            <Route path="/teacher/absented/:attendance_record" component={TeachersAbsentedPage} />
            <Route path="/teacher/grades/:studying_id" component={TeachersGradesPage} />
            <Route path="/teacher/enrolled/:teacher/:id" component={TeacherStudyingPage} />
            <Route path="/teacher/subjects/:subject_id" component={TeacherStudyingPage} />

            {/* Default route in a switch */}
            <Route><div className="w-screen h-screen flex justify-center items-center">404: No such page!</div></Route>
        </Switch>
    </>;
}
