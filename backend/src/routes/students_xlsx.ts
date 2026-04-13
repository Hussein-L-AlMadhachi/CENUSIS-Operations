import ExcelJS from 'exceljs';
import multer, { memoryStorage } from 'multer';
import { Router } from 'express';


import { decodeXlsx, encodeXlsx } from '../helpers/xlsx_codec.js';
import { translateHeaders } from "../helpers/headers_translate.js"


// services
import { newStudent, findStudentByName, updateStudent } from '../services/students.js';
import { isValidAdminNoRPC, isValidSuperadminNoRPC, isValidTeacherNoRPC } from '../auth.js';
import { normalize_arabic } from '../helpers/normalize_arabic.js';
import { students, studying, subjects } from '../db.js';




export const upload = multer({ storage: memoryStorage() });

export const studentsXlsxRouter = Router();

studentsXlsxRouter.post('/api/students/import', upload.single('file'), async (req, res) => {

    try {
        const admin_auth = isValidAdminNoRPC(req, res);
        const superadmin_auth = isValidSuperadminNoRPC(req, res);

        if (!admin_auth && !superadmin_auth) {
            res.status(401).json({
                success: false,
                error: "unauthorized"
            })
            return;
        };

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No file uploaded"
            });
        }

        // Cast to any to bypass TypeScript error
        const buffer: any = req.file.buffer;

        const students_js_obj = await decodeXlsx(buffer, [
            "الاسم", "الطالب", "سنة التسجيل", "الدرجة العلمية", "المرحلة",
        ]);

        const loaded_students_record = translateHeaders<any>(students_js_obj, {
            "الاسم": "student_name",
            "الطالب": "student_name",
            "سنة التسجيل": "joined_year",
            "الدرجة العلمية": "degree",
            "المرحلة": "class",
        })

        for (const student of loaded_students_record) {
            try {
                if (!student?.student_name) {
                    continue;
                }

                await students.InsertOrUpdate(
                    String(student.student_name),
                    String(student.joined_year ?? new Date().getFullYear()),
                    String(student.degree ?? ''),
                    Number(student.class ?? 1)
                );
            } catch (e) {
                console.error(`Error processing student ${student.student_name}:`, e);
                res.status(500).json({ success: false, error: e!.toString() });
                return
            }
        }

        // Send the buffer
        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating Excel file');
    }
});



studentsXlsxRouter.post('/api/grades/import/:subjectid', upload.single('file'), async (req, res) => {
    console.log(req.params.subjectid)

    if (!req.params.subjectid) return res.status(400).json({
        success: false,
        error: "No subject id provided"
    });

    const subject_id = parseInt(req.params.subjectid)
    try {
        const [existingSubject] = await subjects.fetch(subject_id);
    } catch (e) {
        console.error(`Error processing subject ${subject_id}:`, e);
        res.status(400).json({ success: false, error: "Invalid subject id" });
        return
    }

    try {
        const admin_auth = isValidAdminNoRPC(req, res);
        const superadmin_auth = isValidSuperadminNoRPC(req, res);
        const teacher_auth = isValidTeacherNoRPC(req, res);

        if (!admin_auth || !superadmin_auth || !teacher_auth) {
            res.status(401).json({
                success: false,
                error: "unauthorized"
            })
            return;
        };

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No file uploaded"
            });
        }

        const workbook = new ExcelJS.Workbook();

        // Cast to any to bypass TypeScript error
        const buffer: any = req.file.buffer;

        const students_js_obj = await decodeXlsx(buffer, [
            "الطالب", "السعي"
        ]);

        const loaded_students_record_array = translateHeaders<any>(students_js_obj, {
            "الطالب": "student_name",
            "السعي": "coursework_grade"
        })

        for (const student of loaded_students_record_array) {
            try {

                const existingStudent = await students.findByName(normalize_arabic(student.student_name) || "");
                const [existingSubject] = await subjects.fetch(subject_id);

                if (!existingStudent || !existingSubject) {
                    throw new Error("Student or subject not found");
                }

                await studying.setCourseworkGrade(student.coursework_grade, existingStudent.id, subject_id);

            } catch (e) {
                console.error(`Error processing student ${student.student_name}:`, e);
                // Continue to next student but log error
                // Optional: collect errors to return partial success?
                // For now just log
            }
        }

        // Send the buffer
        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating Excel file');
    }
});

