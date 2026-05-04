import { PG_App } from 'pg-norm';

// tables
import { Studying } from './Features/studying/studying.sql.js';
import { StudentsTable } from './Features/students/students.sql.js';
import { Subjects } from './Features/subjects/subjects.sql.js';
import { LoggedinUsers } from './Features/loggedin_users/loggedin_users.sql.js';
import { TeachingStaff } from './Features/teaching_staff/teaching_staff.sql.js';
import { Absented } from './Features/absented/absented.sql.js';
import { AttendanceRecord } from './Features/attendance_record/attendance_record.sql.js';
import { GradingSystems } from './Features/grading_system/grading_systems.sql.js';
import { AbsenceAlertThresholds } from './Features/absence_alert_thresholds/absence_alert_thresholds.sql.js';

import { MiniAppsTable } from './Features/miniapps/miniapps.sql.js';
import { MiniAppPermissionsTable } from './Features/miniapp_permissions/minimaps_permissions.sql.js';



// Initialize your application
export const app = new PG_App({
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cenusis_ops',
    username: process.env.DB_USER || 'dev',
    password: process.env.DB_PASSWORD || '12345678'
});



export const loggedin_users = new LoggedinUsers(app);
export const teaching_staff = new TeachingStaff(app);
export const students = new StudentsTable(app);
export const subjects = new Subjects(app);
export const studying = new Studying(app);
export const absented = new Absented(app);
export const attendance_record = new AttendanceRecord(app);
export const grading_systems = new GradingSystems(app);
export const absence_alert_thresholds = new AbsenceAlertThresholds(app);
export const miniapps = new MiniAppsTable(app);
export const miniapp_permissions = new MiniAppPermissionsTable(app);

app.register(loggedin_users);
app.register(teaching_staff);
app.register(students);
app.register(grading_systems);
app.register(absence_alert_thresholds);
app.register(subjects);
app.register(studying);
app.register(attendance_record);
app.register(absented);
