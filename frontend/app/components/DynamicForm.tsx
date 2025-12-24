import { useState, useEffect } from "react";
import { AutocompleteText } from "./AutocompleteText";



export interface DynamicFormTemplate {
    title: string;
    key?: string;
    type: "text" | "number" | "checkbox" | "select" | "autocomplete" | (string & {});
    fieldsCheckbox?: string[];
    options?: { label: string; value: any }[];
    fetchSuggestions?: (query: string) => Promise<string[]> | string[];
    condition?: {
        key: string;
        value: any;
    };
    defaultValue?: any;
    min?: number;
    max?: number;
    disabled?: boolean;
}



interface DynamicFormProps {
    template: DynamicFormTemplate[];
    onSubmit: (data: any) => void | Promise<void>;
    submitLabel: string;
    initialData?: any;
    customComponents?: Record<string, React.ComponentType<{
        value: any;
        onChange: (val: any) => void;
        field: DynamicFormTemplate;
    }>>;
}



export function DynamicForm(props: DynamicFormProps) {

    const [is_loading, setIsLoading] = useState<boolean>(false);
    const [error_msg, setErrorMsg] = useState<string>("");
    const [data, setData] = useState<any>(props.initialData || {});

    useEffect(() => {
        let hasChanges = false;
        const newData = { ...data };

        props.template.forEach((field) => {
            if (field.condition && data[field.condition.key] !== field.condition.value) {
                const key = field.key || field.title;
                if (newData[key] !== field.defaultValue) {
                    newData[key] = field.defaultValue;
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            setData(newData);
        }
    }, [data, props.template]);

    const handleChange = (key: string, value: any) => {
        setData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await props.onSubmit(data);
        } catch (e: any) {
            setErrorMsg(e.toString());
            setTimeout(() => {
                setErrorMsg("");
            }, 10000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 w-full">
            <p className="text-right text-xs mt-2 pr-1.5 text-error">{error_msg ? error_msg : ""}</p>

            <form onSubmit={handleSubmit}>
                {props.template.map((field, i) => {
                    if (field.condition && data[field.condition.key] !== field.condition.value) {
                        return null;
                    }
                    const CustomComponent = props.customComponents?.[field.type];

                    return (
                        <fieldset className="fieldset p-1" key={i}>
                            <legend className="fieldset-legend text-gray-500 text-sm">{field.title}</legend>
                            <div className="flex flex-col flex-nowrap gap-2">
                                {field.type === "text" && (
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data[field.key || field.title] ?? ""}
                                        onChange={(e) => handleChange(field.key || field.title, e.target.value)}
                                        disabled={field.disabled}
                                    />
                                )}
                                {field.type === "number" && (
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        value={data[field.key || field.title] ?? ""}
                                        min={field.min}
                                        max={field.max}
                                        onChange={(e) => handleChange(field.key || field.title, Number(e.target.value))}
                                        disabled={field.disabled} />
                                )}
                                {field.type === "checkbox" && field.fieldsCheckbox && (
                                    <div className="flex gap-4">
                                        {field.fieldsCheckbox.map((option, j) => (
                                            <div key={j} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    checked={((data[field.key || field.title] as string[]) || []).includes(option)}
                                                    onChange={(e) => {
                                                        const key = field.key || field.title;
                                                        const currentValues = (data[key] as string[]) || [];
                                                        if (e.target.checked) {
                                                            handleChange(key, [...currentValues, option]);
                                                        } else {
                                                            handleChange(
                                                                key,
                                                                currentValues.filter((v) => v !== option)
                                                            );
                                                        }
                                                    }}
                                                    disabled={field.disabled}
                                                />
                                                <span>{option}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {field.type === "select" && field.options && (
                                    <select
                                        className="select select-bordered w-full"
                                        value={data[field.key || field.title] ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const originalOption = field.options?.find((opt) => String(opt.value) === val);
                                            handleChange(field.key || field.title, originalOption ? originalOption.value : val);
                                        }}
                                        disabled={field.disabled}
                                    >
                                        <option disabled value="">
                                            اختر {field.title}
                                        </option>
                                        {field.options.map((opt, k) => (
                                            <option key={k} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {field.type === "autocomplete" && field.fetchSuggestions && (
                                    <AutocompleteText
                                        fetchSuggestions={field.fetchSuggestions}
                                        onSelect={(val) => handleChange(field.key || field.title, val)}
                                        onChange={(val) => handleChange(field.key || field.title, val)}
                                        value={data[field.key || field.title] ?? ""}
                                        placeholder={`ابحث عن ${field.title}`}
                                        className="w-full"
                                        ghost={false}
                                        expand={true}
                                    />
                                )}
                                {CustomComponent && (
                                    <CustomComponent
                                        value={data[field.key || field.title]}
                                        onChange={(val: any) => handleChange(field.key || field.title, val)}
                                        field={field}
                                    />
                                )}
                            </div>
                        </fieldset>
                    );
                })}
            </form>

            {
                is_loading ?
                    <div className="mt-5 flex w-full justify-center">
                        <span className="loading loading-spinner loading-xl text-center text-neutral"></span>
                    </div> :
                    <button type="submit" onClick={handleSubmit} className="btn btn-primary w-full mt-4">
                        {props.submitLabel}
                    </button>
            }

        </div >
    );
}

