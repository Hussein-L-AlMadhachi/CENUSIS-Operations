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
import { type AbsentedData, superAdminRPC } from "@/rpc";
import { Link, useParams } from "wouter";
import { sidebar_pages } from "./sidebar_pages";
import { navigate } from "wouter/use-browser-location";







interface OptionsProps {
    onAddClick: () => void;
}



function Options({ onAddClick }: OptionsProps) {
    return <div id="options" className="menu lg:menu-horizontal menu-vertical w-full justify-between">
        <Link href={`/superadmin/subjects`} className="btn btn-md btn-ghost btn-circle">
            <ArrowRightFromLine />
        </Link>
        <div className="text-4xl text-center max-sm:py-10 max-md:w-full"> إدارة الغيابات </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1 menu-vertical max-md:w-full">

            <li>
                <button className="btn" onClick={onAddClick}>
                    <UserRoundPlus size={18} /> إضافة غياب
                </button>
            </li>

        </ul>
    </div>;
}



interface AddAbsentStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    record_id: number;
}



function AddAbsentStudentModal({ isOpen, onClose, onSuccess, record_id }: AddAbsentStudentModalProps) {
    const handleAddAbsentStudent = async (data: any) => {
        if (!data.student_name || !data.hours_absent) {
            throw "يجب ملئ جميع الحقول";
        }

        try {
            await superAdminRPC.markStudentAbsent({
                attendance_record_id: record_id, student_name: data.student_name,
                hours_absent: data.hours_absent
            });
            onSuccess();
            onClose();
        } catch (error) {
            throw `حدث خطأ أثناء إضافة الحساب ${error}`;
        }

        navigate("/admin/subjects")
    };

    return (
        <Modal isOpen={isOpen} className="w-full flex flex-col justify-center max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">تسجيل غياب طالب</h3>

            <DynamicForm
                key={isOpen ? "open" : "closed"}
                template={[
                    { title: "اسم الطالب", key: "student_name", type: "autocomplete", fetchSuggestions: async (query: string) => await superAdminRPC.autocompleteStudent(query) },
                    { title: "ساعات الغياب", key: "hours_absent", type: "number" }
                ]}
                onSubmit={handleAddAbsentStudent}
                submitLabel="حفظ"
            />

            <button className="btn btn-ghost w-2xs mt-4" onClick={onClose}>إلغاء</button>
        </Modal>
    );
}



function MainContent(): JSX.Element {

    const params = useParams<{ attendance_record: string }>();
    if (!params.attendance_record) {
        throw "invalid attendance record"
    }

    const attendance_record_id = parseInt(params.attendance_record);

    const [data, setData] = useState<AbsentedData[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchData = () => {
        superAdminRPC.fetchAbsentStudents(attendance_record_id).then((data) => setData(data));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const customRenderers: Record<string, (row: AbsentedData) => JSX.Element> = {

        "@delete": (row: AbsentedData) => {
            if (row.id === undefined) {
                return <div>WTF</div>
            }

            return (
                <div className="flex flex-col flex-nowrap">
                    <button onClick={() => superAdminRPC.removeAbsence(row.id!).then(() => navigate("/admin/subjects/"))} className="btn btn-xs">
                        حذف
                    </button>
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
                    headers={{ "student_name": "الاسم", "hours_absent": "عدد ساعات الغياب", "@delete": "" }}
                    customRenderers={customRenderers}
                />

            </Subsection>
        </Section>

        <AddAbsentStudentModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchData}
            record_id={attendance_record_id}
        />
    </>;

}







export function SuperAbsentedPage(): JSX.Element {
    useValidRoute(["superadmin"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"غيابات الطلاب"}
            sidebar={sidebar_pages}
        />
    </>
}
