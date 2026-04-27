import { type JSX, useState, useEffect, useCallback } from "react";
import { ArrowRightFromLine, Upload } from "lucide-react";

// layouts
import { MainLayout } from "@/layout/MainLayout";

// Components
import { EditableTable } from "@/components/EditableTable";
import { Section, Subsection } from "@/components/Section";
import { buildGradeTable } from "@/helpers/grade_table";

// Hooks
import { useValidRoute } from "@/hooks/useValidRoute";

// Globals
import { type GradesDate, teacherRPC } from "@/rpc";
import { Link, useParams } from "wouter";
import { sidebar_pages } from "./sidebar_pages";







interface OptionsProps {
    onImportSuccess: () => void;
    studying_id: number;
}



function Options({ onImportSuccess, studying_id }: OptionsProps) {

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`/api/grades/import/${studying_id}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                onImportSuccess();
            } else {
                const result = await response.json();
                alert("خطأ في معالجة الملف: " + result.error);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("خطأ في رفع الملف");
        }
    };

    return <div id="options" className="menu lg:menu-horizontal menu-vertical w-full justify-between">
        <Link href="/teacher/subjects" className="btn btn-md btn-ghost btn-circle">
            <ArrowRightFromLine />
        </Link>
        <div className="text-4xl text-center max-sm:py-10 max-md:w-full"> رفع درجات الطلاب </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1 menu-vertical max-md:w-full">

            <li>
                <label className="btn">
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <Upload size={18} /> رفع البيانات من برنامج أكسل
                </label>
            </li>
        </ul>
    </div>;
}







function MainContent(): JSX.Element {
    const params = useParams<{ studying_id: string }>();
    if (!params.studying_id) {
        throw "invalid studying id"
    }

    const [data, setData] = useState<GradesDate[]>([]);

    const fetchData = useCallback(() => {
        if (params.studying_id) {
            teacherRPC.fetchStudentGradeFieldsPerStudying(parseInt(params.studying_id)).then((data) => {
                setData(data);
            });
        }
    }, [params.studying_id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { headers, rows } = buildGradeTable(data || []);

    return <>
        <Section>
            <Subsection>
                <Options onImportSuccess={fetchData} studying_id={parseInt(params.studying_id)} />
            </Subsection>
            <Subsection>

                <EditableTable
                    data={rows}
                    headers={headers}
                />

            </Subsection>
        </Section>

    </>;
}







export function TeachersGradesPage(): JSX.Element {
    useValidRoute(["teacher"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"رفع درجات السعي"}
            sidebar={sidebar_pages}
        />
    </>
}


