import { type JSX, useState, useEffect } from "react";
import { UserRoundPlus, Search } from "lucide-react";

// layouts
import { MainLayout } from "@/layout/MainLayout";

// Components
import { EditableTable } from "@/components/EditableTable";
import { Modal } from "@/components/Modal";
import { DynamicForm, type DynamicFormTemplate } from "@/components/DynamicForm";
import { Section, Subsection } from "@/components/Section";
import { AutocompleteText } from "@/components/AutocompleteText";

// Hooks
import { useValidRoute } from "@/hooks/useValidRoute";

// Globals
import { type SubjectData, adminRPC } from "@/rpc";
import { useValidParams } from "@/hooks/useValidParams";
import Tabs from "@/components/Tabs";
import { sidebar_pages } from "./sidebar_pages";



interface OptionsProps {
    onAddClick: () => void;
}



function Options({ onAddClick }: OptionsProps) {
    return <div className="flex justify-between flex-wrap">
        <div className="text-4xl px-5"> إدارة المواد الدراسية </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1">

            <li>
                <button className="btn btn-lg" onClick={onAddClick}>
                    <UserRoundPlus size={18} /> إضافة مادة
                </button>
            </li>

            <li>
                <span>
                    <Search size={18} />
                    <AutocompleteText
                        placeholder="ابحث عن مادة..."
                        fetchSuggestions={adminRPC.autocompleteSubject}
                        onSelect={(selected) => {
                            console.log("User selected:", selected);
                        }}
                    />
                </span>
            </li>
        </ul>
    </div>;
}



interface AddSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const subjectFormTemplate: DynamicFormTemplate[] = [
    { title: "اسم المادة", key: "subject_name", type: "text" },
    {
        title: "الدرجة العلمية", key: "degree",
        type: "select", options: [
            { label: "بكالوريوس", value: "بكالوريوس" },
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
        ], condition: { key: "degree", value: "بكالوريوس" }
    },
    {
        title: "الكورس", key: "semester", type: "select", options: [
            { label: "الأول", value: 1 },
            { label: "الثاني", value: 2 },
        ], condition: { key: "degree", value: "بكالوريوس" }
    },
    { title: "عدد ساعات في الكورس", key: "total_hours", type: "number", min: 0 },
    { title: "عدد الساعات اسبوعياً", key: "hours_weekly", type: "number", min: 0 },
    { title: "التدريسي", key: "teacher_name", type: "autocomplete", fetchSuggestions: adminRPC.autocompleteTeacher },
];

function AddSubjectModal({ isOpen, onClose, onSuccess }: AddSubjectModalProps) {
    const handleAddSubject = async (data: any) => {

        try {
            useValidParams(data, [
                "subject_name", "degree", "class", "total_hours", "hours_weekly",
                "semester", "teacher_name"]
            );
            if (data.degree !== "بكالوريوس") {
                data["class"] = 1;
            }

            await adminRPC.newSubject(data);
            onSuccess();
            onClose();
        } catch (error) {
            throw `حدث خطأ أثناء إضافة الحساب: ${error}`;
        }
    };

    return (
        <Modal isOpen={isOpen} className="w-full flex flex-col justify-center max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">إضافة طالب جديد</h3>

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

    const [data_1st, setData_1st] = useState<SubjectData[]>([]);
    const [data_2nd, setData_2nd] = useState<SubjectData[]>([]);
    const [data_3rd, setData_3rd] = useState<SubjectData[]>([]);
    const [data_4th, setData_4th] = useState<SubjectData[]>([]);
    const [data_master, setData_master] = useState<SubjectData[]>([]);
    const [data_phd, setData_phd] = useState<SubjectData[]>([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchData = () => {
        adminRPC.filterSubjectsByClassDegree("بكالوريوس", 1).then((data) => setData_1st(data));
        adminRPC.filterSubjectsByClassDegree("بكالوريوس", 2).then((data) => setData_2nd(data));
        adminRPC.filterSubjectsByClassDegree("بكالوريوس", 3).then((data) => setData_3rd(data));
        adminRPC.filterSubjectsByClassDegree("بكالوريوس", 4).then((data) => setData_4th(data));

        adminRPC.filterSubjectsByDegree("ماجستير").then((data) => setData_master(data));

        adminRPC.filterSubjectsByDegree("دكتوراه").then((data) => setData_phd(data));

    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateSubject = async (id: number, data: any) => {
        await adminRPC.updateSubject(id, data).then(() => fetchData());
    };

    const handleDeleteSubject = async (id: number) => {
        await adminRPC.deleteSubject(id).then(() => fetchData());
    };

    const table_headers = {
        "subject_name": "الاسم",
        "teacher_name": "التدريسي", "degree": "الدرجة العلمية", "class": "المرحلة",
        "semester": "الكورس", "@view_students": "",
        ":edit:": ""
    }

    const customRenderers: Record<string, (row: SubjectData) => JSX.Element> = {
        "@view_students": (row: SubjectData) => {

            return (
                <div className="flex flex-col flex-nowrap gap-1">
                    <a href={`/admin/enrolled/${row.teacher}/${row.id}`} className="btn btn-xs  w-32">
                        عرض الطلاب
                    </a>
                    <a href={`/admin/attendance/${row.id}`} className="btn btn-xs w-32">
                        عرض سجل الغياب
                    </a>
                    <a href={`/admin/grades/${row.id}`} className="btn btn-xs w-32">
                        عرض درجات السعي
                    </a>
                    <a href={`/admin/permissions/${row.id}`} className="btn btn-xs w-32">
                        عرض الصلاحيات
                    </a>
                </div>
            )
        },
    }

    return <>
        <Section>
            <Subsection>
                <Options onAddClick={() => setIsAddModalOpen(true)} />
            </Subsection>
            <Subsection>
                <Tabs group="students" tabs={
                    [
                        {
                            label: "المرحلة الأولى", content: <EditableTable
                                data={data_1st || []}
                                headers={table_headers}
                                onDelete={handleDeleteSubject}
                                onSave={handleUpdateSubject}
                                formTemplate={subjectFormTemplate}
                                customRenderers={customRenderers}
                            />
                        },
                        {
                            label: "المرحلة الثانية", content: <EditableTable
                                data={data_2nd || []}
                                headers={table_headers}
                                onDelete={handleDeleteSubject}
                                onSave={handleUpdateSubject}
                                formTemplate={subjectFormTemplate}
                                customRenderers={customRenderers}
                            />
                        },
                        {
                            label: "المرحلة الثالثة", content: <EditableTable
                                data={data_3rd || []}
                                headers={table_headers}
                                onDelete={handleDeleteSubject}
                                onSave={handleUpdateSubject}
                                formTemplate={subjectFormTemplate}
                                customRenderers={customRenderers}
                            />
                        },
                        {
                            label: "المرحلة الرابعة", content: <EditableTable
                                data={data_4th || []}
                                headers={table_headers}
                                onDelete={handleDeleteSubject}
                                onSave={handleUpdateSubject}
                                formTemplate={subjectFormTemplate}
                                customRenderers={customRenderers}
                            />
                        },
                        {
                            label: "الماجستير", content: <EditableTable
                                data={data_master || []}
                                headers={table_headers}
                                onDelete={handleDeleteSubject}
                                onSave={handleUpdateSubject}
                                formTemplate={subjectFormTemplate}
                                customRenderers={customRenderers}
                            />
                        },
                        {
                            label: "الدكتوراه", content: <EditableTable
                                data={data_phd || []}
                                headers={table_headers}
                                onDelete={handleDeleteSubject}
                                onSave={handleUpdateSubject}
                                formTemplate={subjectFormTemplate}
                                customRenderers={customRenderers}
                            />
                        }
                    ]
                } />
            </Subsection>
        </Section>

        <AddSubjectModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchData}
        />
    </>;
}




export function SubjectsPage(): JSX.Element {
    useValidRoute(["admin"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"المواد الدراسية"}
            sidebar={sidebar_pages}
        />
    </>
}
