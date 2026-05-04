import type { Metadata } from "enders-sync";
import type postgres from "postgres";

import { absence_alert_thresholds, grading_systems, studying } from "../../db.js";
import { normalize_arabic } from "../../helpers/normalize_arabic.js";
import { loose_validate_params } from "../../helpers/validate_params.js";

type ThresholdPayload = {
    grading_system_id?: number;
    grading_system_name?: string;
    alert_name?: string;
    threshold_percent?: number;
};

function normalizeThresholdPercent(value: unknown): number {
    const normalized = Number(value);
    if (!Number.isFinite(normalized) || normalized < 0 || normalized > 100) {
        throw new Error("threshold_percent must be a number between 0 and 100");
    }

    return Number(normalized.toFixed(2));
}

async function resolveGradingSystemId(data: ThresholdPayload): Promise<number> {
    if (typeof data.grading_system_id === "number") {
        const [gradingSystem] = await grading_systems.fetch(data.grading_system_id);
        if (!gradingSystem) {
            throw new Error("grading system not found");
        }

        return gradingSystem.id as number;
    }

    if (typeof data.grading_system_name === "string" && data.grading_system_name.trim() !== "") {
        const gradingSystem = await grading_systems.findByName(normalize_arabic(data.grading_system_name.trim()));
        if (!gradingSystem) {
            throw new Error("grading system not found");
        }

        return gradingSystem.id as number;
    }

    throw new Error("grading_system_id or grading_system_name is required");
}

export async function newAbsenceAlertThreshold(metadata: Metadata, data: ThresholdPayload) {
    loose_validate_params(data as unknown as Record<string, unknown>, ["alert_name", "threshold_percent"]);

    const alertName = data.alert_name?.trim();
    if (!alertName) {
        throw new Error("alert_name is required");
    }

    const gradingSystemId = await resolveGradingSystemId(data);
    const thresholdPercent = normalizeThresholdPercent(data.threshold_percent);

    const [threshold] = await absence_alert_thresholds.insert({
        grading_system_id: gradingSystemId,
        alert_name: alertName,
        threshold_percent: thresholdPercent
    });

    if (!threshold) {
        throw new Error("failed to create absence alert threshold");
    }

    return threshold.id;
}

export async function updateAbsenceAlertThreshold(metadata: Metadata, id: number, data: ThresholdPayload) {
    loose_validate_params(data as unknown as Record<string, unknown>, ["alert_name", "threshold_percent"]);

    if (typeof id !== "number") {
        throw new Error("id must be a number");
    }

    const updates: Record<string, unknown> = {};

    if (data.alert_name !== undefined) {
        const alertName = data.alert_name.trim();
        if (!alertName) {
            throw new Error("alert_name cannot be empty");
        }
        updates.alert_name = alertName;
    }

    if (data.threshold_percent !== undefined) {
        updates.threshold_percent = normalizeThresholdPercent(data.threshold_percent);
    }

    if (data.grading_system_id !== undefined || data.grading_system_name !== undefined) {
        updates.grading_system_id = await resolveGradingSystemId(data);
    }

    if (Object.keys(updates).length === 0) {
        return id;
    }

    await absence_alert_thresholds.update(id, updates);
    return id;
}

export async function deleteAbsenceAlertThreshold(metadata: Metadata, id: number) {
    await absence_alert_thresholds.delete(id);
}

export async function fetchAbsenceAlertThresholds(
    metadata: Metadata,
    filters?: { grading_system_name?: string }
): Promise<postgres.RowList<postgres.Row[]>> {
    return await absence_alert_thresholds.listAllWithGradingSystemName(filters?.grading_system_name);
}

export async function recomputeAbsenceAlerts(metadata: Metadata) {
    const thresholds = await absence_alert_thresholds.listAllWithGradingSystemName();
    const candidates = await studying.fetchAbsenceAlertCandidates();

    const thresholdsBySystemId = new Map<number, { alert_name: string; threshold_percent: number }[]>();

    for (const threshold of thresholds) {
        const gradingSystemId = Number(threshold.grading_system_id);
        if (!thresholdsBySystemId.has(gradingSystemId)) {
            thresholdsBySystemId.set(gradingSystemId, []);
        }

        thresholdsBySystemId.get(gradingSystemId)!.push({
            alert_name: String(threshold.alert_name),
            threshold_percent: Number(threshold.threshold_percent)
        });
    }

    for (const systemThresholds of thresholdsBySystemId.values()) {
        systemThresholds.sort((a, b) => a.threshold_percent - b.threshold_percent);
    }

    let updated = 0;
    for (const candidate of candidates) {
        const gradingSystemId = Number(candidate.grading_system_id);
        const subjectTotalHours = Number(candidate.total_hours);
        const hoursMissed = Number(candidate.hours_missed);
        const currentAlertLevel = candidate.alert_level === null ? null : String(candidate.alert_level);

        const subjectThresholds = thresholdsBySystemId.get(gradingSystemId) ?? [];
        const absenceRatioPercent = subjectTotalHours > 0 ? (hoursMissed / subjectTotalHours) * 100 : 0;

        let nextAlertLevel: string | null = null;
        for (const threshold of subjectThresholds) {
            if (absenceRatioPercent >= threshold.threshold_percent) {
                nextAlertLevel = threshold.alert_name;
            }
        }

        if (nextAlertLevel !== currentAlertLevel) {
            await studying.setAlertLevel(Number(candidate.studying_id), nextAlertLevel);
            updated += 1;
        }
    }

    return { updated };
}

export async function fetchAbsenceAlerts(
    metadata: Metadata,
    filters?: { degree?: string; class?: number; grading_system_name?: string }
): Promise<postgres.RowList<postgres.Row[]>> {
    return await studying.fetchAbsenceAlerts(filters?.degree, filters?.class, filters?.grading_system_name);
}

