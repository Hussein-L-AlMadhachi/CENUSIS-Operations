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
import { type SubjectAccessControlData, adminRPC } from "@/rpc";
import { sidebar_pages } from "./sidebar_pages";
import { Link, useParams } from "wouter";







interface OptionsProps {
    onAddClick: () => void;
}

function Options({ onAddClick }: OptionsProps) {
    return <div id="options" className="menu lg:menu-horizontal menu-vertical w-full justify-between">
        <Link href="/admin/subjects" className="btn btn-md btn-ghost btn-circle">
            <ArrowRightFromLine />
        </Link>
        <div className="text-4xl text-center max-sm:py-10 max-md:w-full"> إدارة الصلاحيات </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1 menu-vertical max-md:w-full">

            <li>
                <button className="btn" onClick={onAddClick}>
                    <UserRoundPlus size={18} /> إضافة صلاحيات
                </button>
            </li>

        </ul>
    </div>;
}







interface AddPermissionEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function AddPermissionEntryModal({ isOpen, onClose, onSuccess }: AddPermissionEntryModalProps) {
    const handleAddPermissionEntry = async (data: any) => {
        console.log(data)
        if (!data.teacher_name || !data.subject_name) {
            throw "يجب ملئ جميع الحقول";
        }

        try {
            await adminRPC.grantAccess(data.subject_name, data.teacher_name);
            onSuccess();
            onClose();
        } catch (error) {
            throw `حدث خطأ أثناء إضافة الحساب ${error}`;
        }
    };

    return (
        <Modal isOpen={isOpen} className="w-full flex flex-col justify-center max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">إضافة أستاذ مساعد</h3>

            <DynamicForm
                key={isOpen ? "open" : "closed"}
                template={[
                    {
                        title: "اسم الحساب",
                        key: "teacher_name",
                        type: "autocomplete",
                        fetchSuggestions: (q) => adminRPC.autocompleteTeacher(q)
                    },
                    {
                        title: "اسم المادة",
                        key: "subject_name",
                        type: "autocomplete",
                        fetchSuggestions: (q) => adminRPC.autocompleteSubject(q)
                    },
                ]}
                onSubmit={handleAddPermissionEntry}
                submitLabel="حفظ"
            />

            <button className="btn btn-ghost w-2xs mt-4" onClick={onClose}>إلغاء</button>
        </Modal>
    );
}



function MainContent(): JSX.Element {
    const params = useParams();
    if (!params.subject_id) {
        throw "invalid subject"
    }

    const subject_id = parseInt(params.subject_id);

    const [data, setData] = useState<SubjectAccessControlData[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const fetchData = () => {
        adminRPC.fetchSubjectAccessControl(subject_id).then((data) => { setData(data); console.log("fetched data", data) });
    };

    useEffect(() => {
        fetchData();
    }, []);


    const customRenderers: Record<string, (row: SubjectAccessControlData) => JSX.Element> = {
        "@revoke": (row: SubjectAccessControlData) => {

            return (
                <div className="flex flex-col flex-nowrap">
                    <button className="btn btn-error btn-xs w-10 text-white" onClick={() => adminRPC.revokeAccess(subject_id, row.loggedin_user!).then(() => fetchData())}> ازالة </button>
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

                <EditableTable
                    data={data || []}
                    headers={{ "subject_name": "اسم المادة", "user_name": "اسم الحساب", "@revoke": "" }}
                    onDelete={(id: number) => {
                        adminRPC.revokeAccess(subject_id, id).then(() => fetchData());
                    }}
                    customRenderers={customRenderers}
                />

            </Subsection>
        </Section>

        <AddPermissionEntryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchData}
        />
    </>;
}



export function PermissionsPage(): JSX.Element {
    useValidRoute(["admin"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"صلاحيات الأستاذ مساعد"}
            sidebar={sidebar_pages}
        />
    </>
}
