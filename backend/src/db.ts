import { PG_App } from 'pg-norm';

// tables
import { Studying } from './db/studying.js';
import { StudentsTable } from './db/students.js';
import { Subjects } from './db/subjects.js';
import { LoggedinUsers } from './db/loggedin_users.js';
import { TeachingStaff } from './db/teaching_staff.js';
import { Absented } from './db/absented.js';
import { AttendanceRecord } from './db/attendance_record.js';

// views
import { StudentAbsenceView } from './db/views/students_absence_view.js';
import { AttendanceRecordView } from './db/views/attendance_record_view.js';
import { ActivityLogs } from './db/logs.js';
import { EnrollmentView } from './db/views/enrollment_view.js';
import { SubjectsAccessControl } from './db/subjects_access_control.js';



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
export const attendance_record_view = new AttendanceRecordView(app);
export const student_absence_view = new StudentAbsenceView(app);
export const activity_logs = new ActivityLogs(app);
export const enrollment_view = new EnrollmentView(app);
export const subjects_access_control = new SubjectsAccessControl(app);

app.register(loggedin_users);
app.register(teaching_staff);
app.register(students);
app.register(subjects);
app.register(studying);
app.register(attendance_record);
app.register(absented);
//app.register(student_absence_view);
//app.register(attendance_record_view);
//app.register(enrollment_view);
app.register(activity_logs);
app.register(subjects_access_control);



/**
 *  full connection options
 * 
 * {
 *      host                 : '',              // Postgres ip address[es] or domain name[s]
 *      port                 : 5432,            // Postgres server port[s]
 *      path                 : '',              // unix socket path (usually '/tmp')
 *      database             : '',              // Name of database to connect to
 *      username             : '',              // Username of database user
 *      password             : '',              // Password of database user
 *      ssl                  : false,           // true, prefer, require, tls.connect options
 *      max                  : 10,              // Max number of connections
 *      max_lifetime         : null,            // Max lifetime in seconds (more info below)
 *      idle_timeout         : 0,               // Idle connection timeout in seconds
 *      connect_timeout      : 30,              // Connect timeout in seconds
 *      prepare              : true,            // Automatic creation of prepared statements
 *      types                : [],              // Array of custom types, see more below
 *      onnotice             : fn,              // Default console.log, set false to silence NOTICE
 *      onparameter          : fn,              // (key, value) when server param change
 *      debug                : fn,              // Is called with (connection, query, params, types)
 *      socket               : fn,              // fn returning custom socket to use
 *      transform            : {
 *          undefined          : undefined,     // Transforms undefined values (eg. to null)
 *          column             : fn,            // Transforms incoming column names
 *          value              : fn,            // Transforms incoming row values
 *          row                : fn             // Transforms entire rows
 *      },
 *      connection           : {
 *          application_name   : 'postgres.js', // Default application_name
 *          ...                                 // Other connection parameters, see https://www.postgresql.org/docs/current/runtime-config-client.html
 *      },
 *      target_session_attrs : null,            // Use 'read-write' with multiple hosts to
 *                                              // ensure only connecting to primary
 *      fetch_types          : true,            // Automatically fetches types on connect
 *                                              // on initial connection.
 * }
 * 
 */

