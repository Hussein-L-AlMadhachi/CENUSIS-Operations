import multer, { memoryStorage } from 'multer';
import { Router } from 'express';
import ExcelJS from 'exceljs';


import { decodeXlsx } from '../helpers/xlsx_codec.js';
import { translateHeaders } from "../helpers/headers_translate.js"


// services
import { isValidAdminNoRPC, isValidSuperadminNoRPC, isValidTeacherNoRPC } from '../auth.js';
import { normalize_arabic } from '../helpers/normalize_arabic.js';
import { students, studying, subjects, grading_systems } from '../db.js';




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

    if (!req.params.subjectid) return res.status(400).json({
        success: false,
        error: "No subject id provided"
    });

    const subject_id = parseInt(req.params.subjectid)
    let existingSubject;
    try {
        [existingSubject] = await subjects.fetch(subject_id);
    } catch (e) {
        console.error(`Error processing subject ${subject_id}:`, e);
        res.status(400).json({ success: false, error: "Invalid subject id" });
        return
    }

    if (!existingSubject) {
        res.status(400).json({ success: false, error: "Invalid subject id" });
        return;
    }

    try {
        const admin_auth = isValidAdminNoRPC(req, res);
        const superadmin_auth = isValidSuperadminNoRPC(req, res);
        const teacher_auth = isValidTeacherNoRPC(req, res);

        if (!admin_auth && !superadmin_auth && !teacher_auth) {
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

        // Fetch the subject to get the grading system
        const grading_system_id = existingSubject?.grading_system_id;

        let fieldNames: string[] = [];
        if (grading_system_id) {
            const [gs] = await grading_systems.fetch(grading_system_id);
            if (gs?.fields) {
                fieldNames = (gs.fields as { field_name: string }[]).map(f => f.field_name);
            }
        }

        const students_js_obj = await decodeXlsx(buffer, [
            "اسم الطالب",
            ...fieldNames,
        ]);

        const headerTranslations: Record<string, string> = {
            "اسم الطالب": "student_name",
        };
        for (const fieldName of fieldNames) {
            headerTranslations[fieldName] = fieldName;
        }

        const loaded_students_record_array = translateHeaders<any>(students_js_obj, headerTranslations);

        for (const row of loaded_students_record_array) {
            try {

                const existingStudent = await students.findByName(normalize_arabic(row.student_name) || "");

                if (!existingStudent) {
                    const err_msg = `النظام لم يتمكن من قراءة الحقول بالملف. تأكد من وجود الحقول في هذه الحقول في السطر الأول من الملف: (${fieldNames},اسم الطالب)`
                    throw err_msg
                }

                const grade_fields = fieldNames.map(name => ({
                    name,
                    grade: Number(row[name] ?? 0)
                }));

                await studying.setGradeFields(grade_fields, existingSubject.id as number, existingStudent.id as number);

            } catch (e) {
                console.error(`Error processing student ${row.student_name}:`, e);
                res.status(400).json({ success: true, err: `${e}` });
                return
            }
        }

        // Send the buffer
        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error extracting Excel file');
    }
});


studentsXlsxRouter.get('/api/grades/export', async (req, res) => {
    try {
        const superadmin_auth = isValidSuperadminNoRPC(req, res);

        if (!superadmin_auth) {
            res.status(401).json({
                success: false,
                error: "unauthorized"
            });
            return;
        }

        const degree = req.query.degree as string;
        const class_number = parseInt(req.query.class as string);
        const grading_system = req.query.grading_system as string;

        if (!degree || isNaN(class_number) || !grading_system) {
            res.status(400).json({
                success: false,
                error: "Missing or invalid degree, class, or grading_system parameter"
            });
            return;
        }

        const subjectsList = await subjects.filterByClassDegreeGradingSystem(degree, class_number, grading_system);

        if (!subjectsList || subjectsList.length === 0) {
            res.status(404).json({
                success: false,
                error: "No subjects found for the specified class and degree"
            });
            return;
        }

        const gradesData = await studying.getGradesByClassDegree(degree, class_number, grading_system);

        const subjectFieldsMap: Map<number, { subject_name: string; fields: string[] }> = new Map();

        for (const subject of subjectsList) {
            let fieldNames: string[] = [];
            if (subject.grading_system_id) {
                const [gs] = await grading_systems.fetch(subject.grading_system_id);
                if (gs?.fields) {
                    fieldNames = (gs.fields as { field_name: string }[]).map(f => f.field_name);
                }
            }
            subjectFieldsMap.set(subject.id as number, {
                subject_name: subject.subject_name as string,
                fields: fieldNames
            });
        }

        const studentGradesMap: Map<number, { student_name: string; grades: Map<number, Record<string, number>> }> = new Map();

        for (const row of gradesData) {
            const studentId = row.student_id as number;
            const subjectId = row.subject_id as number;

            if (!studentGradesMap.has(studentId)) {
                studentGradesMap.set(studentId, {
                    student_name: row.student_name as string,
                    grades: new Map()
                });
            }

            const gradeFields = (row.grade_fields as { name: string; grade: number }[]) || [];
            const gradeRecord: Record<string, number> = {};
            for (const field of gradeFields) {
                gradeRecord[field.name] = field.grade;
            }

            studentGradesMap.get(studentId)!.grades.set(subjectId, gradeRecord);
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Grades');

        const columnKeys: { subjectId: number; fieldName: string }[] = [];
        const subjectHeaderRow: string[] = ['اسم الطالب'];
        const fieldHeaderRow: string[] = [''];
        const mergeRanges: { startCol: number; endCol: number }[] = [];

        let currentCol = 2;
        for (const [subjectId, subjectInfo] of subjectFieldsMap) {
            const fieldCount = subjectInfo.fields.length;
            if (fieldCount === 0) continue;

            subjectHeaderRow.push(subjectInfo.subject_name);
            for (let i = 1; i < fieldCount; i++) {
                subjectHeaderRow.push('');
            }

            for (const fieldName of subjectInfo.fields) {
                fieldHeaderRow.push(fieldName);
                columnKeys.push({ subjectId, fieldName });
            }

            if (fieldCount > 1) {
                mergeRanges.push({ startCol: currentCol, endCol: currentCol + fieldCount - 1 });
            }
            currentCol += fieldCount;
        }

        subjectHeaderRow.push('المعدل');
        const avgColIndex = currentCol;

        worksheet.addRow(subjectHeaderRow);
        worksheet.addRow(fieldHeaderRow);

        worksheet.mergeCells(1, 1, 2, 1);
        worksheet.mergeCells(1, avgColIndex, 2, avgColIndex);
        for (const range of mergeRanges) {
            worksheet.mergeCells(1, range.startCol, 1, range.endCol);
        }

        const row1 = worksheet.getRow(1);
        const row2 = worksheet.getRow(2);
        row1.font = { bold: true };
        row2.font = { bold: true };
        row1.alignment = { horizontal: 'center', vertical: 'middle' };
        row2.alignment = { horizontal: 'center', vertical: 'middle' };

        const thinBorder: Partial<ExcelJS.Borders> = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        const lastGradeCol = 1 + columnKeys.length;
        for (let col = 2; col <= lastGradeCol; col++) {
            const cell1 = row1.getCell(col);
            const cell2 = row2.getCell(col);

            cell1.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFECB3' }
            };
            cell1.font = { bold: true, color: { argb: 'FF8B4513' } };
            cell1.border = thinBorder;

            cell2.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFECB3' }
            };
            cell2.font = { bold: true, color: { argb: 'FF8B4513' } };
            cell2.border = thinBorder;
        }

        const studentNameCell1 = row1.getCell(1);
        const studentNameCell2 = row2.getCell(1);
        studentNameCell1.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC8E6C9' }
        };
        studentNameCell1.font = { bold: true, color: { argb: 'FF1B5E20' } };
        studentNameCell1.border = thinBorder;
        studentNameCell2.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC8E6C9' }
        };
        studentNameCell2.font = { bold: true, color: { argb: 'FF1B5E20' } };
        studentNameCell2.border = thinBorder;

        const avgHeaderCell1 = row1.getCell(avgColIndex);
        const avgHeaderCell2 = row2.getCell(avgColIndex);
        avgHeaderCell1.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        avgHeaderCell1.font = { bold: true, color: { argb: 'FFFF6600' } };
        avgHeaderCell1.border = thinBorder;
        avgHeaderCell2.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        avgHeaderCell2.font = { bold: true, color: { argb: 'FFFF6600' } };
        avgHeaderCell2.border = thinBorder;

        const columnGrades: number[][] = columnKeys.map(() => []);

        let currentRowNum = 3;
        for (const [, studentData] of studentGradesMap) {
            const rowData: (string | number)[] = [studentData.student_name];
            const subjectTotals: Map<number, number> = new Map();

            columnKeys.forEach(({ subjectId, fieldName }, colIdx) => {
                const subjectGrades = studentData.grades.get(subjectId);
                const grade = subjectGrades?.[fieldName];
                if (typeof grade === 'number') {
                    rowData.push(grade);
                    subjectTotals.set(subjectId, (subjectTotals.get(subjectId) ?? 0) + grade);
                    if (columnGrades[colIdx]) {
                        columnGrades[colIdx].push(grade);
                    }
                } else {
                    rowData.push('');
                }
            });

            const subjectTotalsArray = Array.from(subjectTotals.values());
            const studentAvg = subjectTotalsArray.length > 0
                ? Math.round((subjectTotalsArray.reduce((a, b) => a + b, 0) / subjectTotalsArray.length) * 100) / 100
                : '';
            rowData.push(studentAvg);

            worksheet.addRow(rowData);

            const studentNameCell = worksheet.getRow(currentRowNum).getCell(1);
            studentNameCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFC8E6C9' }
            };
            studentNameCell.font = { color: { argb: 'FF1B5E20' } };
            studentNameCell.border = thinBorder;

            const studentAvgCell = worksheet.getRow(currentRowNum).getCell(avgColIndex);
            studentAvgCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
            studentAvgCell.font = { color: { argb: 'FFFF6600' } };
            studentAvgCell.border = thinBorder;

            currentRowNum++;
        }

        const avgRow: (string | number)[] = ['المعدل'];
        const minRow: (string | number)[] = ['الحد الأدنى'];
        const maxRow: (string | number)[] = ['الحد الأعلى'];

        for (const grades of columnGrades) {
            if (grades.length > 0) {
                const avg = Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 100) / 100;
                const min = Math.min(...grades);
                const max = Math.max(...grades);
                avgRow.push(avg);
                minRow.push(min);
                maxRow.push(max);
            } else {
                avgRow.push('');
                minRow.push('');
                maxRow.push('');
            }
        }

        avgRow.push('');
        minRow.push('');
        maxRow.push('');

        const avgRowRef = worksheet.addRow(avgRow);
        const minRowRef = worksheet.addRow(minRow);
        const maxRowRef = worksheet.addRow(maxRow);

        const summaryRows = [avgRowRef, minRowRef, maxRowRef];
        for (const row of summaryRows) {
            row.eachCell({ includeEmpty: false }, (cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE0E0E0' }
                };
                cell.font = { bold: true, color: { argb: 'FFFF6600' } };
                cell.border = thinBorder;
            });
            row.getCell(1).alignment = { horizontal: 'center' };
        }

        worksheet.columns.forEach(column => {
            column.width = 15;
        });
        worksheet.getColumn(1).width = 25;

        const buffer = await workbook.xlsx.writeBuffer();

        const filename = `grades_class${class_number}_${Date.now()}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error generating Excel file' });
    }
});

