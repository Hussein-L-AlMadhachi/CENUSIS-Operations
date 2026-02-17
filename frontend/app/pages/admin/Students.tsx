import { type JSX, useState, useEffect } from "react";
import { Search, UserRoundPlus, Upload } from "lucide-react";

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
import { type studentData, adminRPC } from "@/rpc";
import { useValidParams } from "@/hooks/useValidParams";
import Tabs from "@/components/Tabs";
import { sidebar_pages } from "./sidebar_pages";



interface OptionsProps {
    onAddClick: () => void;
    onImportSuccess: () => void;
}



function Options({ onAddClick, onImportSuccess }: OptionsProps) {

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/students/import", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                onImportSuccess();
            } else {
                const result = await response.json();
                alert("خطأ في استيراد الملف: " + result.error);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("خطأ في استيراد الملف");
        }
    };


    return <div id="options" className="menu lg:menu-horizontal menu-vertical w-full justify-between">
        <div className="text-4xl text-center max-sm:py-10 max-md:w-full"> إدارة الطلاب </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1 menu-vertical max-md:w-full">

            <li>
                <button className="btn btn-lg" onClick={onAddClick}>
                    <UserRoundPlus size={18} /> إضافة طالب
                </button>
            </li>

            <li>
                <label className="btn btn-lg">
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <Upload size={18} /> إدخال البيانات من برنامج أكسل
                </label>
            </li>

            <li>
                <span>
                    <Search size={18} />
                    <AutocompleteText
                        placeholder=""
                        fetchSuggestions={adminRPC.autocompleteStudent}
                        onSelect={(selected) => {
                            console.log("User selected:", selected);
                        }}
                    />
                </span>
            </li>
        </ul>
    </div>;
}



interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const studentFormTemplate: DynamicFormTemplate[] = [
    { title: "الاسم الكامل", key: "student_name", type: "text" },
    { title: "السنة التسجيل", key: "joined_year", type: "number" },
    {
        title: "الدرجة العلمية", key: "degree",
        type: "select", options: [
            { label: "بكلوريوس", value: "بكلوريوس" },
            { label: "ماجستير", value: "ماجستير" },
            { label: "دكتوراه", value: "دكتوراه" }
        ], defaultValue: "بكلوريوس"
    },
    {
        title: "المرحلة", key: "class", type: "select", options: [
            { label: "الأولى", value: 1 },
            { label: "الثانية", value: 2 },
            { label: "الثالثة", value: 3 },
            { label: "الرابعة", value: 4 }
        ], condition: { key: "degree", value: "بكلوريوس" }, defaultValue: 1
    },
    {
        title: "الجنس", key: "sex", type: "select", options: [
            { label: "ذكر", value: "ذكر" }, { label: "أنثى", value: "انثى" }
        ]
    }
];

function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
    const handleAddTeacher = async (data: any) => {

        try {
            useValidParams(data, ["student_name", "joined_year", "degree", "sex"])
            if (data.degree !== "بكلوريوس") {
                data["class"] = 1;
            }

            await adminRPC.newStudent(data);
            onSuccess();
            onClose();
        } catch (error) {
            throw `حدث خطأ أثناء إضافة الحساب: ${error}`;
        }
    };

    return (
        <Modal isOpen={isOpen} className="w-full flex flex-col justify-center max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">إضافة حساب تدريسي جديد</h3>

            <DynamicForm
                key={isOpen ? "open" : "closed"}
                template={studentFormTemplate}
                onSubmit={handleAddTeacher}
                submitLabel="حفظ"
            />

            <button className="btn btn-ghost w-2xs mt-4" onClick={onClose}>إلغاء</button>
        </Modal>
    );
}


function MainContent(): JSX.Element {

    const [data_1st, setData_1st] = useState<studentData[]>([]);
    const [data_2nd, setData_2nd] = useState<studentData[]>([]);
    const [data_3rd, setData_3rd] = useState<studentData[]>([]);
    const [data_4th, setData_4th] = useState<studentData[]>([]);
    const [data_master, setData_master] = useState<studentData[]>([]);
    const [data_phd, setData_phd] = useState<studentData[]>([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchData = () => {
        adminRPC.filterStudentsByClassDegree("بكلوريوس", 1).then((data) => setData_1st(data));
        adminRPC.filterStudentsByClassDegree("بكلوريوس", 2).then((data) => setData_2nd(data));
        adminRPC.filterStudentsByClassDegree("بكلوريوس", 3).then((data) => setData_3rd(data));
        adminRPC.filterStudentsByClassDegree("بكلوريوس", 4).then((data) => setData_4th(data));

        adminRPC.filterStudentsByDegree("ماجستير").then((data) => setData_master(data));

        adminRPC.filterStudentsByDegree("دكتوراه").then((data) => setData_phd(data));

    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStudent = async (id: number, data: any) => {
        await adminRPC.updateStudent(id, data);
        fetchData();
    };

    const handleDeleteStudent = async (id: number) => {
        await adminRPC.deleteStudent(id);
        fetchData();
    };

    const headers = {
        "student_name": "الاسم", "joined_year": "السنة التسجيل",
        "degree": "الدرجة العلمية", "class": "المرحلة", ":edit:": ""
    };

    return <>
        <Section>
            <Subsection>
                <Options onAddClick={() => setIsAddModalOpen(true)} onImportSuccess={fetchData} />
            </Subsection>
            <Subsection>
                <Tabs group="students" tabs={
                    [
                        {
                            label: "المرحلة الأولى", content: <EditableTable
                                data={data_1st || []}
                                headers={headers}
                                onDelete={handleDeleteStudent}
                                onSave={handleUpdateStudent}
                                formTemplate={studentFormTemplate}
                            />
                        },
                        {
                            label: "المرحلة الثانية", content: <EditableTable
                                data={data_2nd || []}
                                headers={headers}
                                onDelete={handleDeleteStudent}
                                onSave={handleUpdateStudent}
                                formTemplate={studentFormTemplate}
                            />
                        },
                        {
                            label: "المرحلة الثالثة", content: <EditableTable
                                data={data_3rd || []}
                                headers={headers}
                                onDelete={handleDeleteStudent}
                                onSave={handleUpdateStudent}
                                formTemplate={studentFormTemplate}
                            />
                        },
                        {
                            label: "المرحلة الرابعة", content: <EditableTable
                                data={data_4th || []}
                                headers={headers}
                                onDelete={handleDeleteStudent}
                                onSave={handleUpdateStudent}
                                formTemplate={studentFormTemplate}
                            />
                        },
                        {
                            label: "الماجستير", content: <EditableTable
                                data={data_master || []}
                                headers={headers}
                                onDelete={handleDeleteStudent}
                                onSave={handleUpdateStudent}
                                formTemplate={studentFormTemplate}
                            />
                        },
                        {
                            label: "الدكتوراه", content: <EditableTable
                                data={data_phd || []}
                                headers={headers}
                                onDelete={handleDeleteStudent}
                                onSave={handleUpdateStudent}
                                formTemplate={studentFormTemplate}
                            />
                        }
                    ]
                } />
            </Subsection>
        </Section>

        <AddStudentModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchData}
        />
    </>;
}


//
export function StudentsPage(): JSX.Element {
    useValidRoute(["admin"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"معلومات الطلاب"}
            sidebar={sidebar_pages}
        />
    </>
}
