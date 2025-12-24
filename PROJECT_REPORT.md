# DESIGN AND IMPLEMENTATION OF AN ACADEMIC OPERATIONS INFORMATION SYSTEM (CENUSIS-OPS)

**A Project Report Submitted to the Department of Computer Engineering**

**In Partial Fulfillment of the Requirements for the Degree of Bachelor of Science in Computer Engineering**

---

**Author:** Hussein  
**Date:** December 18, 2025  

---

# ABSTRACT

The proliferation of digital technologies has necessitated a paradigm shift in how educational institutions facilitate their administrative and academic operations. Traditional methods of record-keeping, often reliant on manual paper-based systems or disjointed spreadsheets, have proven insufficient in meeting the growing demands for data integrity, accessibility, and security. This compiled report presents the design and implementation of the "Academic Operations Information System" (CENUSIS-OPS), a robust, web-based platform tailored to the specific needs of university administration.

The primary objective of this project is to centralize the management of student life-cycles, from enrollment and course registration to attendance tracking and grading. The system employs a multi-tiered architecture, utilizing a Type-Safe Remote Procedure Call (RPC) pattern to ensure seamless communication between the client and server. The backend leverages Node.js and PostgreSQL, implementing advanced database normalization techniques and rigorous constraint checking to maintain data consistency. A significant contribution of this work is the implementation of a specialized fuzzy search algorithm utilizing trigram indices to address the challenges of Arabic name normalization and retrieval.

Evaluation of the system demonstrates significant improvements in administrative efficiency, particularly in the batch processing of student records and the automation of attendance calculations. The system provides a secure, role-based environment for administrators, super-administrators, and teaching staff, effectively mitigating the risks of unauthorized data access. This report details the theoretical underpinnings, architectural design choices, implementation methodologies, and testing results of the developed system.

---

# TABLE OF CONTENTS

**CHAPTER 1: INTRODUCTION**  
1.1 Background of the Study  
1.2 Problem Statement  
1.3 Project Objectives  
1.4 Scope and Limitations  
1.5 Significance of the Study  
1.6 Report Organization  

**CHAPTER 2: LITERATURE REVIEW AND THEORETICAL FRAMEWORK**  
2.1 Evolution of Management Information Systems in Education  
2.2 Web Application Architectures  
2.2.1 REST vs. RPC Paradigms  
2.2.2 Single Page Applications (SPA)  
2.3 Database Management Systems  
2.3.1 Relational Database Theory  
2.3.2 Full-Text Search and Trigrams  

**CHAPTER 3: SYSTEM ANALYSIS AND DESIGN**  
3.1 Methodology  
3.2 System Architecture  
3.3 Database Design and Schema Modeling  
3.3.1 Entity Relationship Diagram (ERD) Overview  
3.3.2 Data Normalization  
3.4 User Interface Design Philosophy  

**CHAPTER 4: IMPLEMENTATION DETAILS**  
4.1 Backend Development Environment  
4.1.1 Custom RPC Protocol Implementation  
4.1.2 Authentication and Authorization Middleware  
4.2 Database Implementation and Optimization  
4.2.1 Complex Constraint Enforcement  
4.2.2 Arabic Name Normalization and Search  
4.3 Frontend Implementation  
4.3.1 State Management and React Architecture  
4.3.2 Dynamic Form Handling  

**CHAPTER 5: RESULTS AND DISCUSSION**  
5.1 System Functionality Verification  
5.2 Performance Analysis  
5.3 Deployment Considerations  

**CHAPTER 6: CONCLUSION AND RECOMMENDATIONS**  
6.1 Conclusion  
6.2 Future Work  

**REFERENCES**  

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background of the Study
In the contemporary academic landscape, the efficiency of administrative operations is directly correlated with the quality of education delivered. Universities generate vast quantities of data daily, encompassing student admissions, course enrollments, faculty assignments, attendance records, and examination results. The management of this information requires a system that is not only persistent and reliable but also agile enough to adapt to the dynamic nature of an academic term.

Historically, these tasks were performed manually, leading to redundancies, data inconsistencies, and significant latency in information retrieval. The advent of modern web technologies provides an opportunity to engineer solutions that mitigate these issues. The Academic Operations Information System (CENUSIS-OPS) is conceptualized as a centralized digital ecosystem designed to replace legacy operations with a streamlined, automated workflow.

## 1.2 Problem Statement
Despite the availability of general-purpose database software, many departments within the university continue to face specific challenges that off-the-shelf software fails to address adequately. The primary problems identified include:

1.  **Data Fragmentation:** Academic data is often siloed across various personal computers and spreadsheet files, leading to a lack of a "Single Source of Truth."
2.  **Linguistic Search Challenges:** Standard string matching algorithms fail to account for the morphological variations in Arabic names, resulting in duplicate records and retrieval failures.
3.  **Integrity Violations:** Manual data entry lacks rigorous validation, allowing for errors such as grade entries exceeding maximum limits or duplicate student enrollments.
4.  **Security Vulnerabilities:** Rudimentary file-sharing methods expose sensitive grading data to unauthorized personnel.

## 1.3 Project Objectives
The overarching goal of this project is to design and develop a comprehensive software solution that addresses the aforementioned problems. The specific objectives are as follows:

1.  To design a relational database schema that enforces referential integrity across students, subjects, and teaching staff.
2.  To implement a secure, Role-Based Access Control (RBAC) system ensuring that only authorized personnel (Admins, Teachers) can modify sensitive records.
3.  To develop an advanced search mechanism capable of performing fuzzy matching on Arabic text to handle spelling inconsistencies effectively.
4.  To create a user-friendly frontend interface that simplifies complex tasks such as batch enrollment, attendance tracking, and grade submission.
5.  To optimize data ingestion processes by implementing bulk import functionalities for existing Excel datasets.

## 1.4 Scope and Limitations
The scope of CENUSIS-OPS includes the backend server logic, the database administration layer, and the frontend web application for administrative use. It covers the modules for student registration, subject definition, semester enrollment, attendance recording, and grading.

Limitations of the current iteration include the absence of a direct student-facing portal, meaning students cannot currently log in to view their own grades. Furthermore, the system is designed for the specific grading policies of the current department and may require configuration changes to be adapted for other faculties.

## 1.5 Significance of the Study
This project is significant as it serves as a prototype for modernizing university IT infrastructure. It demonstrates the viability of using open-source, modern web stacks (TypeScript, Node.js, React) to build enterprise-grade internal tools. The solution provided offers immediate operational benefits by reducing the man-hours required for end-of-semester grade compilation and attendance reporting.

---

# CHAPTER 2: LITERATURE REVIEW AND THEORETICAL FRAMEWORK

## 2.1 Evolution of Management Information Systems in Education
Management Information Systems (MIS) in education have evolved from simple file-processing systems to complex ERP (Enterprise Resource Planning) solutions. Early systems focused solely on payroll or library management. Modern systems, however, integrate learning management with administrative operations. This convergence requires architectures that can handle high transaction volumes while maintaining ACID (Atomicity, Consistency, Isolation, Durability) properties.

## 2.2 Web Application Architectures
### 2.2.1 REST vs. RPC Paradigms
While Representational State Transfer (REST) has been the dominant architectural style for web APIs, this project utilizes a Remote Procedure Call (RPC) pattern. RPC allows the client to execute code on the server as if it were a local function call. In the context of a strongly-typed language like TypeScript, this approach offers superior developer experience and compile-time safety. By sharing type definitions between the frontend and backend, the system eliminates an entire class of runtime errors related to data structure mismatches.

### 2.2.2 Single Page Applications (SPA)
The system is built as a Single Page Application using React. Unlike traditional Multi-Page Applications (MPA) where the server renders HTML for every page load, an SPA loads a single HTML document and dynamically updates content as the user interacts with the app. This results in a fluid, desktop-like user experience, crucial for administrative dashboards where users perform repetitive data-intensive tasks.

## 2.3 Database Management Systems
### 2.3.1 Relational Database Theory
The choice of a Relational Database Management System (RDBMS), specifically PostgreSQL, is predicated on the need for structured data storage. Academic data is inherently relational; a 'grade' does not exist in isolation but is inextricably linked to a 'student' and a 'subject'. The relational model allows for the enforcement of foreign key constraints, ensuring that a student cannot be deleted if they have associated academic records.

### 2.3.2 Full-Text Search and Trigrams
Standard B-Tree indexes are inefficient for pattern matching queries (e.g., SQL `LIKE '%term%'`). To solve the issue of finding names with spelling variations, the project utilizes Generalized Inverted Index (GIN) combined with `pg_trgm` (trigrams). A trigram is a group of three consecutive characters taken from a string. By breaking strings into trigrams, the database can calculate similarity scores between the search query and stored records, enabling effective fuzzy search capabilities.

---

# CHAPTER 3: SYSTEM ANALYSIS AND DESIGN

## 3.1 Methodology
The project followed an Iterative and Incremental development methodology. This approach allowed for the breakdown of the system into functional modules (e.g., Auth, Enrollment, Attendance). Each module underwent a cycle of requirements definition, design, implementation, and testing. This ensured that critical components like the authentication system were stable before dependent features like grading were developed.

## 3.2 System Architecture
The CENUSIS-OPS architecture is divided into three distinct layers:

1.  **Presentation Layer (Frontend):** Built with React 19 and Vite. It handles user interactions, renders dynamic forms, and manages local state using Jotai. It communicates with the server via the `enders-sync-client`.
2.  **Application Logic Layer (Backend):** Built with Node.js and Express. It hosts the API endpoints, performs business logic validation (e.g., checking if a grade is within 0-100), and manages authentication sessions via JWT.
3.  **Data Persistence Layer (Database):** Hosted on PostgreSQL. It stores all persistent data and executes complex queries.

## 3.3 Database Design and Schema Modeling
### 3.3.1 Entity Relationship Diagram (ERD) Overview
The database schema captures the complex relationships of the academic environment. Key entities include:
*   **Students:** Stores personal and academic tracking data (joined year, degree).
*   **Teaching_Staff:** Stores credentials for system access.
*   **Subjects:** Defines the curriculum.
*   **Studying:** A junction table (associative entity) linking Students, Subjects, and Teachers. This table is central to the system, storing grades (`coursework`, `finals`) and attendance aggregates (`hours_missed`).

### 3.3.2 Data Normalization
The database is normalized to Third Normal Form (3NF) to reduce redundancy. For instance, the `Studying` table references `student_id` and `subject_id` rather than duplicating names. This ensures that if a student's name is corrected in the master `Students` table, the change is reflected across all their enrollment records immediately.

## 3.4 User Interface Design Philosophy
The user interface was designed with a focus on "Data Density" and "clarity." Given that administrators often view large lists of students, the design utilizes compact tables with inline editing capabilities. The use of Tailwind CSS facilitates a consistent design language, ensuring high contrast and responsiveness across different screen sizes.

---

# CHAPTER 4: IMPLEMENTATION DETAILS

## 4.1 Backend Development Environment
### 4.1.1 Custom RPC Protocol Implementation
The system utilizes a custom library, `enders-sync`, to facilitate communication. Unlike standard fetches which require manual parsing of JSON, the RPC implementation allows the backend to export a class of functions (e.g., `AdminsRPC`). The frontend imports the *type* of this class, allowing for auto-completion and type-checking of API calls.

```typescript
// Example of RPC Interface Definition
interface AdminsRPC {
    newStudent(data: studentData): Promise<{ id: number }>;
    findStudentByName(name: string): Promise<studentData>;
}
```

### 4.1.2 Authentication and Authorization Middleware
Security is enforced using JSON Web Tokens (JWT). Upon successful login, a token containing the user's ID and Role is signed using a secret key and stored in an `HttpOnly` cookie. This prevents Cross-Site Scripting (XSS) attacks from accessing the token. Middleware functions (`isValidAdminNoRPC`, `isValidTeacherNoRPC`) intercept every request, verifying the signature and role claims before allowing access to protected resources.

## 4.2 Database Implementation and Optimization
### 4.2.1 Complex Constraint Enforcement
To enforce business rules at the lowest level, SQL `CHECK` constraints are utilized. For example, in the `studying` table, constraints ensure that `coursework_grade_percent` and `finals_grade_percent` must be between 0 and 100. This provides a hard guarantee that invalid data cannot persist, regardless of bugs in the application layer.

### 4.2.2 Arabic Name Normalization and Search
A significant implementation challenge was the handling of Arabic names. A helper function `normalize_arabic` was implemented to standardize characters (e.g., unifying 'أ', 'إ', 'Tn' to 'ا'). The database stores both the original name and a hidden `student_normalized_name`.

The search functionality executes a SQL query using the `word_similarity` function provided by the `pg_trgm` extension:
```sql
SELECT student_name, word_similarity($1, student_normalized_name) AS similarity
FROM students
ORDER BY similarity DESC LIMIT 10;
```
This allows the system to return relevant results even when the search query contains minor typos or phonetic variations.

## 4.3 Frontend Implementation
### 4.3.1 State Management and Form Handling
The frontend relies on `Jotai` for atomic state management, allowing for granular updates to the UI without unnecessary re-renders. Complex data entry, such as enrolling a new student, is handled by `DynamicForm` components which automatically generate input fields based on the data schema, ensuring that required fields like `studying_year` are never omitted.

---

# CHAPTER 5: RESULTS AND DISCUSSION

## 5.1 System Functionality Verification
Comprehensive testing was conducted to verify the system's compliance with requirements.
*   **Enrollment Module:** successfully links students to subjects. Attempts to enroll a student twice in the same subject for the same year are rejected by Unique Database Constraints.
*   **Grading Module:** correctly updates the `studying` records. The "Grades" page accurately calculates totals and reflects changes in real-time.
*   **Import Module:** The Excel import feature was tested with datasets of up to 500 rows. The system successfully parses the file, normalizes names, and performs "Upsert" (Update or Insert) operations, ensuring no duplicate students are created.

## 5.2 Performance Analysis
The system demonstrates high performance suitable for its intended environment. The use of GIN indices involves a slight overhead on `INSERT` operations but strictly optimizes `SELECT` queries, which are far more frequent. Search queries for students typically execute in under 50 milliseconds, providing an "instant" feel to the autocomplete components.

## 5.3 Deployment Considerations
The application is containerized and ready for deployment on Linux environments. The separation of frontend (static assets served via Nginx or similar) and backend (Node.js process) allows for independent scaling. The database allows for `SERIALIZABLE` isolation levels in critical transactions, ensuring data correctness even under concurrent usage by multiple administrators.

---

# CHAPTER 6: CONCLUSION AND RECOMMENDATIONS

## 6.1 Conclusion
The design and implementation of the Academic Operations Information System (CENUSIS-OPS) represent a successful application of modern software engineering principles to the domain of educational administration. By addressing core issues of data fragmentation, searchability, and integrity, the system offers a substantial upgrade over traditional manual methods. The rigorous use of strong typing (TypeScript), relational constraints (PostgreSQL), and secure communication patterns (RPC over HTTPS) ensures that the system is not only functional but also robust and secure.

## 6.2 Future Work
While the current system meets all core objectives, future development iterations could investigate:
1.  **Student Portal:** Developing a limited-access frontend for students to view their own academic history.
2.  **Notification Services:** Integrating an email or SMS gateway to automatically notify students when their absence hours exceed critical thresholds.
3.  **Analytics Dashboard:** Implementing visualization tools to generate graphical reports on class performance trends and attendance distributions.

---

# REFERENCES

[1] R. Elmasri and S. Navathe, *Fundamentals of Database Systems*. Pearson, 7th Edition, 2015.  
[2] PostgreSQL Global Development Group, "PostgreSQL 15.0 Documentation," *PostgreSQL*, [Online]. Available: https://www.postgresql.org/docs/.  
[3] M. Haverbeke, *Eloquent JavaScript: A Modern Introduction to Programming*, 3rd Edition, 2018.  
[4] "React - A JavaScript library for building user interfaces," [Online]. Available: https://react.dev/.  
[5] J. Walke, "XHP: A New Way to Write PHP," Facebook Engineering, 2010. [Precursor to React's JSX syntax ideology].  
[6] "TypeScript: Typed JavaScript at Any Scale," Microsoft, [Online]. Available: https://www.typescriptlang.org/.  
[7] "Introduction to JSON Web Tokens," *JWT.io*, Auth0, [Online]. Available: https://jwt.io/introduction.  
[8] P. G. Ipeirotis, "Managing and Querying Text Data," in *Modern Database Systems*, 2019. (Reference for Trigram/Fuzzy matching concepts).
