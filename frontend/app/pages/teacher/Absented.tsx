import { type JSX, useCallback, useState, useEffect } from "react";
import { ArrowRightFromLine } from "lucide-react";

// layouts
import { MainLayout } from "@/layout/MainLayout";

// Components
import { InPlaceEditableTable } from "../../components/InPlaceEditableTable";
import { Section, Subsection } from "@/components/Section";

// Hooks
import { useValidRoute } from "@/hooks/useValidRoute";

// Globals
import { type AbsentedData, teacherRPC } from "@/rpc";
import { Link, useParams } from "wouter";
import { sidebar_pages } from "./sidebar_pages";




function Options() {
    return <div id="options" className="menu lg:menu-horizontal menu-vertical w-full justify-between">
        <Link href={`/teacher/subjects`} className="btn btn-md btn-ghost btn-circle">
            <ArrowRightFromLine />
        </Link>
        <div className="text-4xl text-center max-sm:py-10 max-md:w-full"> إدارة الغيابات </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1 menu-vertical max-md:w-full">

        </ul>
    </div>;
}



function MainContent(): JSX.Element {
    const params = useParams<{ attendance_record: string }>();
    if (!params.attendance_record) {
        throw "invalid attendance record"
    }

    const attendance_record_id = parseInt(params.attendance_record);

    const [data, setData] = useState<AbsentedData[]>([]);

    const fetchData = useCallback(async () => {
        const data = await teacherRPC.fetchAbsentStudents(attendance_record_id);
        setData(data);
    }, [attendance_record_id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInlineSave = async (_id: string | number, row: AbsentedData) => {
        const student_id = row.student_id ?? row.id;

        if (student_id === undefined || !row.student_name || typeof row.hours_absent !== "number" || Number.isNaN(row.hours_absent)) {
            throw "بيانات غير صالحة للتحديث";
        }

        await teacherRPC.markStudentAbsent({
            attendance_record_id: attendance_record_id,
            student_id,
            hours_absent: row.hours_absent,
        });

        await fetchData();
    };

    return <>
        <Section>
            <Subsection>
                <Options />
            </Subsection>
            <Subsection>

                <InPlaceEditableTable
                    data={data || []}
                    headers={{ "student_name": "الاسم", "hours_absent": "عدد ساعات الغياب" }}
                    onSave={handleInlineSave}
                    editableColumns={["hours_absent"]}
                    nonEditableColumns={["student_name", "student_id"]}
                    columnFieldTypes={{ hours_absent: "number" }}
                />

            </Subsection>
        </Section>

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
