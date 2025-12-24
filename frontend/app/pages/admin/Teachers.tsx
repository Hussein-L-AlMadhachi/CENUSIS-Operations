import { type JSX, useState, useEffect } from "react";
import { Search, UserRoundPlus } from "lucide-react";

// layouts
import { MainLayout } from "@/layout/MainLayout";

// Components
import { EditableTable } from "@/components/EditableTable";
import { Modal } from "@/components/Modal";
import { DynamicForm } from "@/components/DynamicForm";
import { Section, Subsection } from "@/components/Section";
import { AutocompleteText } from "@/components/AutocompleteText";

// Hooks
import { useValidRoute } from "@/hooks/useValidRoute";

// Globals
import { type teacherData, adminRPC } from "@/rpc";
import { sidebar_pages } from "./sidebar_pages";



interface OptionsProps {
    onAddClick: () => void;
}



function Options({ onAddClick }: OptionsProps) {
    return <div className="flex justify-between flex-wrap">
        <div className="text-4xl"> إدارة الحسابات </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1">

            <li>
                <button className="btn btn-lg" onClick={onAddClick}>
                    <UserRoundPlus size={18} /> إضافة حساب
                </button>
            </li>

            <li>
                <span>
                    <Search size={18} />
                    <AutocompleteText
                        placeholder="بحث..."
                        fetchSuggestions={async (query: string) => {
                            return await adminRPC.autocompleteTeacher(query);
                        }}
                        onSelect={(selected: string) => {
                            console.log("User selected:", selected);
                        }}
                    />
                </span>
            </li>
        </ul>
    </div>;
}



interface AddTeacherModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function AddTeacherModal({ isOpen, onClose, onSuccess }: AddTeacherModalProps) {
    const handleAddTeacher = async (data: any) => {
        if (!data.teacher_name || !data.password) {
            throw "يجب ملئ جميع الحقول";
        }

        try {
            await adminRPC.registerTeacher(data);
            onSuccess();
            onClose();
        } catch (error) {
            throw `حدث خطأ أثناء إضافة الحساب ${error}`;
        }
    };

    return (
        <Modal isOpen={isOpen} className="w-full flex flex-col justify-center max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">إضافة حساب تدريسي جديد</h3>

            <DynamicForm
                key={isOpen ? "open" : "closed"}
                template={[
                    { title: "الاسم الكامل", key: "teacher_name", type: "text" },
                    { title: "كلمة السر", key: "password", type: "text" }
                ]}
                onSubmit={handleAddTeacher}
                submitLabel="حفظ"
            />

            <button className="btn btn-ghost w-2xs mt-4" onClick={onClose}>إلغاء</button>
        </Modal>
    );
}


function MainContent(): JSX.Element {

    const [data, setData] = useState<teacherData[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchData = () => {
        adminRPC.fetchTeachers().then((data) => setData(data));
    };

    useEffect(() => {
        fetchData();
    }, []);


    return <>
        <Section>
            <Subsection>
                <Options onAddClick={() => setIsAddModalOpen(true)} />
            </Subsection>
            <Subsection>

                <EditableTable
                    data={data || []}
                    headers={{ "teacher_name": "الاسم", ":edit:": "" }}
                    onDelete={(id: number) => {
                        adminRPC.deleteUser(id).then(() => fetchData());
                    }}
                    onSave={(data: any) => {
                        adminRPC.updateUser(data.id, data).then(() => fetchData());
                    }}
                    formTemplate={[
                        { title: "الاسم الكامل", key: "teacher_name", type: "text" },
                        { title: "كلمة السر", key: "password", type: "text" }
                    ]}
                />

            </Subsection>
        </Section>

        <AddTeacherModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchData}
        />
    </>;
}



export function TeachersPage(): JSX.Element {
    useValidRoute(["admin"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"حسابات التدريسيين"}
            sidebar={sidebar_pages}
        />
    </>
}
