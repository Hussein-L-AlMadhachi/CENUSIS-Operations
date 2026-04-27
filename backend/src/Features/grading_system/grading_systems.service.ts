import type { Metadata } from "enders-sync";
import type postgres from "postgres";

import { grading_systems } from "../../db.js";
import { normalize_arabic } from "../../helpers/normalize_arabic.js";
import { loose_validate_params, validate_params } from "../../helpers/validate_params.js";

type GradingSystemField = {
    max_grade: number;
    min_grade: number;
    field_name: string;
};

function validateGradingSystemFields(fields: unknown): asserts fields is GradingSystemField[] {
    if (!Array.isArray(fields)) {
        throw new Error("fields must be an array");
    }

    for (const field of fields) {
        if (typeof field !== "object" || field === null) {
            throw new Error("each grading field must be an object");
        }

        const gradeField = field as Record<string, unknown>;

        if (!Number.isInteger(gradeField.max_grade) || !Number.isInteger(gradeField.min_grade)) {
            throw new Error("max_grade and min_grade must be integers");
        }

        if (typeof gradeField.field_name !== "string" || gradeField.field_name.trim() === "") {
            throw new Error("field_name must be a non-empty string");
        }

        if ((gradeField.min_grade as number) > (gradeField.max_grade as number)) {
            throw new Error("min_grade cannot be greater than max_grade");
        }
    }
}

function normalizePayload(data: Record<string, unknown>) {
    validateGradingSystemFields(data.fields);

    if (typeof data.name !== "string" || data.name.trim() === "") {
        throw new Error("name must be a non-empty string");
    }

    return {
        name: data.name.trim(),
        normalized_name: normalize_arabic(data.name.trim()),
        fields: data.fields
    };
}

export async function newGradingSystem(metadata: Metadata, data: Record<string, unknown>) {
    validate_params(data, ["name", "fields"]);

    const [gradingSystem] = await grading_systems.insert(normalizePayload(data));

    if (!gradingSystem) {
        throw new Error("grading system is already in the database");
    }

    return gradingSystem.id;
}

export async function updateGradingSystem(metadata: Metadata, id: number, data: Record<string, unknown>) {
    loose_validate_params(data, ["name", "fields"]);

    if (typeof id !== "number") {
        throw new Error("id must be a number");
    }

    await grading_systems.update(id, normalizePayload(data));
    return id;
}

export async function deleteGradingSystem(metadata: Metadata, id: number) {
    await grading_systems.delete(id);
}

export async function fetchSingleGradingSystem(metadata: Metadata, id: number) {
    const [result] = await grading_systems.fetch(id);

    if (!result) {
        throw new Error("no grading system found");
    }

    return result;
}

export async function fetchGradingSystems(metadata: Metadata): Promise<postgres.RowList<postgres.Row[]>> {
    const result = await grading_systems.listAll();

    if (!result) {
        throw new Error("no grading systems found");
    }

    return result;
}

export async function autocompleteGradingSystem(metadata: Metadata, name: string): Promise<string[]> {
    const result = await grading_systems.autocomplete(normalize_arabic(name));

    if (!result) {
        throw new Error("no grading systems found");
    }

    return result.map((gradingSystem) => gradingSystem.name);
}

export async function findGradingSystemByName(metadata: Metadata, name: string): Promise<postgres.Row> {
    const result = await grading_systems.findByName(normalize_arabic(name));

    if (!result) {
        throw new Error("no grading system found");
    }

    return result;
}