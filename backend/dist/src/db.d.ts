import { PG_App } from 'pg-norm';
import { Studying } from './db/studying.js';
import { StudentsTable } from './db/students.js';
import { Subjects } from './db/subjects.js';
import { LoggedinUsers } from './db/loggedin_users.js';
import { TeachingStaff } from './db/teaching_staff.js';
import { Absented } from './db/absented.js';
import { AttendanceRecord } from './db/attendance_record.js';
import { StudentAbsenceView } from './db/views/students_absence_view.js';
import { AttendanceRecordView } from './db/views/attendance_record_view.js';
import { ActivityLogs } from './db/logs.js';
import { EnrollmentView } from './db/views/enrollment_view.js';
import { SubjectsAccessControl } from './db/subjects_access_control.js';
export declare const app: PG_App;
export declare const loggedin_users: LoggedinUsers;
export declare const teaching_staff: TeachingStaff;
export declare const students: StudentsTable;
export declare const subjects: Subjects;
export declare const studying: Studying;
export declare const absented: Absented;
export declare const attendance_record: AttendanceRecord;
export declare const attendance_record_view: AttendanceRecordView;
export declare const student_absence_view: StudentAbsenceView;
export declare const activity_logs: ActivityLogs;
export declare const enrollment_view: EnrollmentView;
export declare const subjects_access_control: SubjectsAccessControl;
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
//# sourceMappingURL=db.d.ts.map