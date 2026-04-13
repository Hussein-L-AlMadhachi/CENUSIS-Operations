# CENUSIS Ops Project Poster

## INTRODUCTION
CENUSIS is a web platform that digitizes key university academic workflows: students, subjects, grades, and attendance. It provides role-based access for teachers and administrators on a single system.

## AIM
Build one reliable system for managing student records, attendance, and grading with faster, more accurate academic operations.

## METHODS

### Subjects
- Created structured subject records (program, class, semester, hours).
- Assigned each subject to responsible teaching staff.
- Organized subjects for quick filtering and assignment.

### Data Processing
- Modeled students, staff, subjects, and attendance in PostgreSQL.
- Built TypeScript/Express services with role-based logic.
- Applied input validation before database writes.
- Connected frontend and backend through RPC endpoints.
- Deployed with Docker Compose (frontend, backend, database).

## DISCUSSION
- One platform reduced duplicated records and manual tracking.
- Role-based access improved data security and control.
- Combined attendance and grading improved student monitoring.
- Docker setup made deployment consistent and easier.
- Next step: add analytics and automated reporting.

## SIGNIFICANCE
CENUSIS shows that a focused digital system can modernize academic administration. It improves data quality, speeds up workflows, and supports better academic decisions.
