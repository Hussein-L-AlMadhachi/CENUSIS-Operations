import { type RPC } from "enders-sync";
import {
    deleteAbsenceAlertThreshold,
    fetchAbsenceAlerts,
    fetchAbsenceAlertThresholds,
    newAbsenceAlertThreshold,
    recomputeAbsenceAlerts,
    updateAbsenceAlertThreshold
} from "./absence_alert_thresholds.service.js";

export function absenceAlertThresholdsLoader(rpc: RPC) {
    rpc.add(newAbsenceAlertThreshold);
    rpc.add(updateAbsenceAlertThreshold);
    rpc.add(deleteAbsenceAlertThreshold);
    rpc.add(fetchAbsenceAlertThresholds);
    rpc.add(recomputeAbsenceAlerts);
    rpc.add(fetchAbsenceAlerts);
}

