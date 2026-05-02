import { type JSX, useState, useEffect } from "react";

// layouts
import { MainLayout } from "@/layout/MainLayout";

// Components
import { EditableTable } from "@/components/EditableTable";
import { Modal } from "@/components/Modal";
import { DynamicForm, type DynamicFormTemplate } from "@/components/DynamicForm";
import { Section, Subsection } from "@/components/Section";

// Hooks
import { useValidRoute } from "@/hooks/useValidRoute";

// Globals
import { type SubjectData, teacherRPC } from "@/rpc";
import { useValidParams as validateParams } from "@/hooks/useValidParams";
import { sidebar_pages } from "./sidebar_pages";


interface AddSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const subjectFormTemplate: DynamicFormTemplate[] = [
    { title: "اسم المادة", key: "subject_name", type: "text" },
    { title: "نظام الدرجات", key: "grading_system_name", 
    type: "autocomplete", fetchSuggestions: teacherRPC.autocompleteGradingSystem },
    {
        title: "الدرجة العلمية", key: "degree",
        type: "select", options: [
            { label: "بكلوريوس", value: "بكلوريوس" },
            { label: "ماجستير", value: "ماجستير" },
            { label: "دكتوراه", value: "دكتوراه" }
        ]
    },
    {
        title: "المرحلة", key: "class", type: "select", options: [
            { label: "الأولى", value: 1 },
            { label: "الثانية", value: 2 },
            { label: "الثالثة", value: 3 },
            { label: "الرابعة", value: 4 }
        ], condition: { key: "degree", value: "بكلوريوس" }
    },
    {
        title: "الكورس", key: "semester", type: "select", options: [
            { label: "الأول", value: 1 },
            { label: "الثاني", value: 2 },
        ], condition: { key: "degree", value: "بكلوريوس" }
    },
    { title: "عدد الساعات اسبوعياً", key: "hours_weekly", type: "number", min: 0 },
    { title: "التدريسي", key: "teacher_name", type: "autocomplete", fetchSuggestions: teacherRPC.autocompleteTeacher },
];

function AddSubjectModal({ isOpen, onClose, onSuccess }: AddSubjectModalProps) {
    const handleAddSubject = async (data: SubjectData & Record<string, unknown>) => {

        try {
            validateParams(data, [
                "subject_name", "degree", "class", "total_hours", "hours_weekly",
                "semester", "teacher_name", "grading_system_name"]
            );
            if (data.degree !== "بكلوريوس") {
                data.class = 1;
            }

            await teacherRPC.newSubject(data);
            onSuccess();
            onClose();
        } catch (error) {
            throw `حدث خطأ أثناء إضافة المادة: ${error}`;
        }
    };

    return (
        <Modal isOpen={isOpen} className="w-full flex flex-col justify-center max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">إضافة مادة جديدة</h3>

            <DynamicForm
                key={isOpen ? "open" : "closed"}
                template={subjectFormTemplate}
                onSubmit={handleAddSubject}
                submitLabel="حفظ"
            />

            <button className="btn btn-ghost w-2xs mt-4" onClick={onClose}>إلغاء</button>
        </Modal>
    );
}


function MainContent(): JSX.Element {

    const [data, setData] = useState<SubjectData[]>([]);


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchData = () => {
        teacherRPC.fetchSubjectsByLabTeacher().then((data) => setData(data));

    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateSubject = async (id: number, data: Partial<SubjectData>) => {
        await teacherRPC.updateSubject(id, data).then(() => fetchData());
    };

    const handleDeleteSubject = async (id: number) => {
        await teacherRPC.deleteSubject(id).then(() => fetchData());
    };

    const table_headers = {
        "subject_name": "الاسم",
        "grading_system_name": "نظام الدرجات",
        "teacher_name": "التدريسي", "degree": "الدرجة العلمية", "class": "المرحلة",
        "semester": "الكورس", "@view_students": "",
        ":edit:": ""
    }

    const customRenderers: Record<string, (row: SubjectData) => JSX.Element> = {
        "@view_students": (row: SubjectData) => {

            return (
                <div className="flex flex-col flex-nowrap gap-1">
                    <a href={`/teacher/enrolled/${row.teacher}/${row.id}`} className="btn btn-xs  w-32">
                        عرض الطلاب
                    </a>
                    <a href={`/teacher/attendance/${row.id}`} className="btn btn-xs w-32">
                        عرض سجل الغياب
                    </a>
                    <a href={`/teacher/grades/${row.id}`} className="btn btn-xs w-32">
                        عرض درجات السعي
                    </a>
                </div>
            )
        },
    }

    return <>
        <Section>
            <Subsection>
                <EditableTable
                    data={data || []}
                    headers={table_headers}
                    onDelete={handleDeleteSubject}
                    onSave={handleUpdateSubject}
                    formTemplate={subjectFormTemplate}
                    customRenderers={customRenderers}
                />
            </Subsection>
        </Section>

        <AddSubjectModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchData}
        />
    </>;
}


export function TeachersLabSubjectsPage(): JSX.Element {
    useValidRoute(["teacher"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"المواد المختبرية"}
            sidebar={sidebar_pages}
        />
    </>
}
