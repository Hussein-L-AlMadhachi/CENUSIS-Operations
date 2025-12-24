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
import { type AbsentedData, teacherRPC } from "@/rpc";
import { Link, useParams } from "wouter";
import { sidebar_pages } from "./sidebar_pages";







interface OptionsProps {
    onAddClick: () => void;
}



function Options({ onAddClick }: OptionsProps) {
    return <div className="flex justify-between flex-wrap">
        <Link href={`/teacher/subjects`} className="btn btn-md btn-ghost btn-circle">
            <ArrowRightFromLine />
        </Link>
        <div className="text-4xl"> إدارة الغيابات </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1">

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
            await teacherRPC.markStudentAbsent({
                attendance_record_id: record_id, student_name: data.student_name,
                hours_absent: data.hours_absent
            });
            onSuccess();
            onClose();
        } catch (error) {
            throw `حدث خطأ أثناء إضافة الحساب ${error}`;
        }
    };

    return (
        <Modal isOpen={isOpen} className="w-full flex flex-col justify-center max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">تسجيل غياب طالب</h3>

            <DynamicForm
                key={isOpen ? "open" : "closed"}
                template={[
                    { title: "اسم الطالب", key: "student_name", type: "autocomplete", fetchSuggestions: async (query: string) => await teacherRPC.autocompleteStudent(query) },
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
        teacherRPC.fetchAbsentStudents(attendance_record_id).then((data) => setData(data));
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
                    <button onClick={() => teacherRPC.removeAbsence(row.id!).then(() => fetchData())} className="btn btn-xs">
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
                    headers={{ "student_name": "الاسم", "@delete": "" }}
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







export function TeachersAbsentedPage(): JSX.Element {
    useValidRoute(["teacher"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"غيابات الطلاب"}
            sidebar={sidebar_pages}
        />
    </>
}
