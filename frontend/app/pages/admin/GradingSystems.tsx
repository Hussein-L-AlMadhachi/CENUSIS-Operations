import { type JSX, useEffect, useState } from "react";
import { Search, UserRoundPlus } from "lucide-react";

import { MainLayout } from "@/layout/MainLayout";

import { EditableTable } from "@/components/EditableTable";
import { Modal } from "@/components/Modal";
import { DynamicForm } from "@/components/DynamicForm";
import { Section, Subsection } from "@/components/Section";
import { AutocompleteText } from "@/components/AutocompleteText";

import { useValidRoute } from "@/hooks/useValidRoute";

import {
    type GradingSystemData,
    type GradingSystemFieldData,
    adminRPC
} from "@/rpc";
import { sidebar_pages } from "./sidebar_pages";


interface OptionsProps {
    onAddClick: () => void;
}

function stringifyFields(fields: GradingSystemFieldData[]): string {
    return JSON.stringify(fields, null, 2);
}

function parseFields(fieldsJSON: string): GradingSystemFieldData[] {
    let parsed: unknown;

    try {
        parsed = JSON.parse(fieldsJSON);
    } catch {
        throw "صيغة الحقول يجب أن تكون JSON صحيحة";
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw "الحقول يجب أن تكون مصفوفة JSON وغير فارغة";
    }

    for (const field of parsed) {
        if (typeof field !== "object" || field === null) {
            throw "كل عنصر داخل الحقول يجب أن يكون كائناً";
        }

        const value = field as Record<string, unknown>;

        if (typeof value.field_name !== "string" || value.field_name.trim() === "") {
            throw "field_name مطلوب ويجب أن يكون نصاً";
        }

        if (!Number.isInteger(value.max_grade) || !Number.isInteger(value.min_grade)) {
            throw "max_grade و min_grade يجب أن يكونا أعداداً صحيحة";
        }
    }

    return parsed as GradingSystemFieldData[];
}

function Options({ onAddClick }: OptionsProps) {
    return <div id="options" className="menu lg:menu-horizontal menu-vertical w-full justify-between">
        <div className="text-4xl text-center max-sm:py-10 max-md:w-full"> إدارة أنظمة الدرجات </div>
        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box gap-1 menu-vertical max-md:w-full">

            <li>
                <button className="btn btn-lg" onClick={onAddClick}>
                    <UserRoundPlus size={18} /> إضافة نظام درجات
                </button>
            </li>

            <li>
                <span>
                    <Search size={18} />
                    <AutocompleteText
                        placeholder="بحث..."
                        fetchSuggestions={adminRPC.autocompleteGradingSystem}
                        onSelect={(selected: string) => {
                            console.log("User selected:", selected);
                        }}
                    />
                </span>
            </li>
        </ul>
    </div>;
}

interface AddGradingSystemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function AddGradingSystemModal({ isOpen, onClose, onSuccess }: AddGradingSystemModalProps) {
    const handleAddGradingSystem = async (data: { name?: string, fields_json?: string }) => {
        const name = data.name?.trim();

        if (!name || !data.fields_json) {
            throw "يجب ملئ جميع الحقول";
        }

        const fields = parseFields(data.fields_json);

        await adminRPC.newGradingSystem({ name, fields });
        onSuccess();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} className="w-full flex flex-col justify-center max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">إضافة نظام درجات جديد</h3>

            <DynamicForm
                key={isOpen ? "open" : "closed"}
                template={[
                    { title: "اسم النظام", key: "name", type: "text" },
                    { title: "الحقول (JSON)", key: "fields_json", type: "json" }
                ]}
                customComponents={{
                    json: ({ value, onChange }) => (
                        <textarea
                            className="textarea textarea-bordered w-full h-44"
                            value={typeof value === "string" ? value : ""}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={'[{"field_name":"quiz","min_grade":0,"max_grade":20}]'}
                        />
                    )
                }}
                onSubmit={handleAddGradingSystem}
                submitLabel="حفظ"
            />

            <button className="btn btn-ghost w-2xs mt-4" onClick={onClose}>إلغاء</button>
        </Modal>
    );
}

function MainContent(): JSX.Element {
    const [data, setData] = useState<GradingSystemData[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchData = () => {
        adminRPC.fetchGradingSystems().then((result) => setData(result));
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
                    data={data}
                    headers={{ "name": "اسم النظام", "@fields": "الحقول", ":edit:": "" }}
                    customRenderers={{
                        "@fields": (row) => {
                            const fields = row.fields || [];
                            return <div className="whitespace-pre-wrap text-xs">{stringifyFields(fields)}</div>;
                        }
                    }}
                    onDelete={(id: number) => {
                        adminRPC.deleteGradingSystem(id).then(() => fetchData());
                    }}
                    onSave={(id: number, row: GradingSystemData) => {
                        const name = row.name?.trim();
                        if (!name || !Array.isArray(row.fields) || row.fields.length === 0) {
                            throw "الاسم وحقول النظام مطلوبة";
                        }

                        adminRPC.updateGradingSystem(id, {
                            name,
                            fields: row.fields
                        }).then(() => fetchData());
                    }}
                />
            </Subsection>
        </Section>

        <AddGradingSystemModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchData}
        />
    </>;
}

export function GradingSystemsPage(): JSX.Element {
    useValidRoute(["admin"], "/login");

    return <>
        <MainLayout
            main={MainContent}
            title={"أنظمة الدرجات"}
            sidebar={sidebar_pages}
        />
    </>;
}