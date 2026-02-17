import { Route, Switch } from "wouter";
import type { JSX } from "react";


import { LoginPage } from "@/pages/LoginPage";

import { TeachersPage } from "@/pages/admin/Teachers";
import { StudentsPage } from "@/pages/admin/Students";
import { SubjectsPage } from "@/pages/admin/Subjects";

import { StudyingPage } from "@/pages/admin/Studying";

import { PermissionsPage } from "@/pages/admin/Permissions";
import { TeachersSubjectsPage } from "./pages/teacher/Subjects";
import { TeachersAttendancePage } from "./pages/teacher/Attendance";
import { TeachersAbsentedPage } from "./pages/teacher/Absented";
import { TeachersGradesPage } from "./pages/teacher/Grades";
import { TeacherStudyingPage } from "./pages/teacher/Studying";
import { TA_SubjectsPage } from "./pages/teacher/TA_Subjects";



import { SuperTeachersPage }  from "@/pages/superadmin/Teachers" ;
import { SuperStudentsPage } from "@/pages/superadmin/Students";
import { SuperSubjectsPage } from "@/pages/superadmin/Subjects";

import { SuperStudyingPage } from "@/pages/superadmin/Studying";
import { SuperAttendancePage } from "@/pages/superadmin/Attendance";
import { SuperAbsentedPage } from "@/pages/superadmin/Absented";

import { SuperPermissionsPage } from "@/pages/superadmin/Permissions";
import { SuperGradesPage } from "./pages/superadmin/Grades";




export default function App(): JSX.Element {
    return <>
        <Switch>
            <Route path="/" component={LoginPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/admin/teachers" component={TeachersPage} />
            <Route path="/admin/students" component={StudentsPage} />
            <Route path="/admin/subjects" component={SubjectsPage} />
            <Route path="/admin/enrolled/:teacher/:id" component={StudyingPage} />
            <Route path="/admin/permissions/:subject_id" component={PermissionsPage} />

            <Route path="/teacher/subjects" component={TeachersSubjectsPage} />
            <Route path="/teacher/ta_subjects" component={TA_SubjectsPage} />
            <Route path="/teacher/attendance/:subject_id" component={TeachersAttendancePage} />
            <Route path="/teacher/absented/:attendance_record" component={TeachersAbsentedPage} />
            <Route path="/teacher/grades/:studying_id" component={TeachersGradesPage} />
            <Route path="/teacher/enrolled/:teacher/:id" component={TeacherStudyingPage} />
            <Route path="/teacher/subjects/:subject_id" component={TeacherStudyingPage} />

            <Route path="/superadmin/teachers" component={SuperTeachersPage} />
            <Route path="/superadmin/students" component={SuperStudentsPage} />
            <Route path="/superadmin/subjects" component={SuperSubjectsPage} />
            <Route path="/superadmin/enrolled/:teacher/:id" component={SuperStudyingPage} />
            <Route path="/superadmin/permissions/:subject_id" component={SuperPermissionsPage} />
            <Route path="/superadmin/attendance/:subject_id" component={SuperAttendancePage} />
            <Route path="/superadmin/absented/:attendance_record" component={SuperAbsentedPage} />
            <Route path="/superadmin/grades/:studying_id" component={SuperGradesPage} />



            {/* Default route in a switch */}
            <Route><div className="w-full h-screen flex justify-center items-center">404: No such page!</div></Route>
        </Switch>
    </>;
}
