import { type JSX, useState, useEffect } from "react";
import { ArrowRightFromLine, UserRoundPlus } from "lucide-react";

// layouts
import { MainLayout } from "@/layout/MainLayout";

// Components
import { EditableTable } from "@/components/EditableTable";
import { Modal } from "@/components/Modal";
import { DynamicForm } from "@/components/DynamicForm";
import { Section, Subsection } from "@/components/Section";

// Hooks
import { useValidRoute } from "@/hooks/useValidRoute";

// Globals
import { type EnrollmentData, superAdminRPC, type studentData } from "@/rpc";
import { Link, useParams } from "wouter";
import { sidebar_pages } from "./sidebar_pages";






interface OptionsProps {
    onAddClick: () => void;
}



function Options({ onAddClick }: OptionsProps) {
    return <div id="options" className="menu lg:menu-horizontal menu-vertical w-full justify-between">
        <Link href="/superadmin/subjects" className="btn btn-md btn-ghost btn-circle">
            <ArrowRightFromLine />
        </Link>
        <div className="text-4xl text-center max-sm:py-10 max-md:w-full"> الطلبة المسجلين </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1 menu-vertical max-md:w-full">

            <li>
                <button className="btn" onClick={onAddClick}>
                    <UserRoundPlus size={18} /> تسجيل طالب
                </button>
            </li>
        </ul>
    </div>;
}



interface EnrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    subjectId: number;
    teacherId: number;
}

function EnrollModal({ isOpen, onClose, onSuccess, subjectId, teacherId }: EnrollModalProps) {
    const handleAddEnrollment = async (data: any) => {
        if (!data.student_name) {
            throw "يجب اختيار طالب";
        }

        try {
            // Find student by name to get ID
            const student: studentData = await superAdminRPC.findStudentByName(data.student_name);
            console.log(">>>", student);
            if (!student || !student.id) {
                throw "الطالب غير موجود";
            }

            const enrollmentData: EnrollmentData = {
                subject_id: subjectId,
                student_id: student.id,
                teacher_id: teacherId,
                student_name: student.name,

                // Required fields by backend with defaults for new enrollment
                studying_year: Number(data.studying_year),
                exam_retakes: Number(data.exam_retakes || 0),
                semester_retakes: Number(data.semester_retakes || 0),
                hours_missed: Number(data.hours_missed || 0),
                coursework_grade_percent: Number(data.coursework_grade_percent || 0),
                finals_grade_percent: Number(data.finals_grade_percent || 0),
            };

            await superAdminRPC.newEnrollment(enrollmentData);
            onSuccess();
            onClose();
        } catch (error) {
            throw `حدث خطأ أثناء إضافة الطالب: ${error}`;
        }
    };

    return (
        <Modal isOpen={isOpen} className="w-full flex flex-col justify-center max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">تسجيل طالب في المادة</h3>

            <DynamicForm
                key={isOpen ? "open" : "closed"}
                template={[
                    {
                        title: "اسم الطالب",
                        key: "student_name",
                        type: "autocomplete",
                        fetchSuggestions: (q) => superAdminRPC.autocompleteStudent(q)
                    },
                    {
                        title: "السنة الدراسية",
                        key: "studying_year",
                        type: "number",
                        defaultValue: new Date().getFullYear()
                    },
                    {
                        title: "نسبة درجة السعي المئوية",
                        key: "coursework_grade_percent",
                        type: "number",
                        min: 0,
                        max: 100,
                        defaultValue: 0
                    },
                    {
                        title: "نسبة الامتحان النهائي المئوية",
                        key: "finals_grade_percent",
                        type: "number",
                        min: 0,
                        max: 100,
                        defaultValue: 0
                    }
                ]}
                onSubmit={handleAddEnrollment}
                submitLabel="إضافة"
            />

            <button className="btn btn-ghost w-2xs mt-4" onClick={onClose}>إلغاء</button>
        </Modal>
    );
}


function MainContent(): JSX.Element {
    const params = useParams();
    const subjectId = parseInt(params.id || "0", 10);
    const teacherId = parseInt(params.teacher || "0", 10);

    const [data, setData] = useState<EnrollmentData[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    console.log(">>>", data);

    const fetchData = () => {
        if (subjectId) {
            superAdminRPC.fetchEnrollmentsForSubject(subjectId).then((data) => {
                setData(data);
                console.log(">>>", data);
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [subjectId]);

    return <>
        <Section>
            <Subsection>
                <Options onAddClick={() => setIsAddModalOpen(true)} />
            </Subsection>
            <Subsection>
                <EditableTable
                    data={data || []}
                    headers={{
                        "student_name": "اسم الطالب",
                        "hours_missed": "غيابات",
                        "coursework_grade_percent": "نسبة درجة السعي المئوية",
                        "finals_grade_percent": "نسبة درجة السعي المئوية",
                        "studying_year": "سنة",
                        ":edit:": ""
                    }}
                    onDelete={(id: number) => {
                        superAdminRPC.deleteEnrollment(id).then(() => fetchData());
                    }}
                    onSave={async (id: number, form_data: any) => {
                        try {
                            const updates: Partial<EnrollmentData> = { ...form_data };

                            // If name changed, we need to find the new ID
                            if (form_data.student_name) {
                                const student = await superAdminRPC.findStudentByName(form_data.student_name);
                                if (student && student.id) {
                                    updates.student_id = student.id;
                                    updates.student_name = student.name;
                                }
                            }
                            await superAdminRPC.updateEnrollment(id, updates);
                            fetchData();
                        } catch (e) {
                            console.error("Update failed", e);
                            alert("حدث خطأ أثناء التعديل");
                        }
                    }}
                    formTemplate={[
                        {
                            title: "اسم الطالب",
                            key: "student_name",
                            type: "autocomplete",
                            fetchSuggestions: (q) => superAdminRPC.autocompleteStudent(q)
                        },
                        { title: "ساعات الغياب", key: "hours_missed", type: "number", min: 0 },
                        { title: "نسبة درجة السعي المئوية", key: "coursework_grade_percent", type: "number", min: 0, max: 100 },
                        { title: "نسبة درجة السعي المئوية", key: "finals_grade_percent", type: "number", min: 0, max: 100 },
                        { title: "عدد المحاولات", key: "semester_retakes", type: "number", min: 0 },
                        { title: "السنة الدراسية", key: "studying_year", type: "number" }
                    ]}
                />
            </Subsection>
        </Section>

        <EnrollModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchData}
            subjectId={subjectId}
            teacherId={teacherId}
        />
    </>;
}



export function SuperStudyingPage(): JSX.Element {
    useValidRoute(["superadmin"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"الطلبة المسجلين"}
            sidebar={sidebar_pages}
        />
    </>
}
