import { saveAs } from "file-saver";

export function exportObservations(observations: any, downloadType: String) {
    console.log(downloadType);
    if (downloadType === "csv") {
        const header = "observationId, resultTime, result";
        const csvContent = observations.value
            .map(
                (observation: {
                    "@iot.id": number;
                    resultTime: string | null;
                    result: string | null;
                }) => {
                    const { "@iot.id": observationId, resultTime, result } = observation;
                    return `${observationId || "null"},${resultTime || "null"},${result || "null"}`;
                }
            )
            .join("\n");
        const csvData = `${header}\n${csvContent}`;
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
        saveAs(blob, "observations.csv");
    } else if (downloadType === "json") {
        const jsonContent = JSON.stringify(observations.value, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8" });
        saveAs(blob, "observations.json");
    }
}
