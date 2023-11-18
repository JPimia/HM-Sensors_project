import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { saveAs } from "file-saver";

function randomizeBorderColor() {
	const red = Math.floor(Math.random() * 256);
	const green = Math.floor(Math.random() * 256);
	const blue = Math.floor(Math.random() * 256);

	return `rgb(${red}, ${green}, ${blue})`;
}

function exportObservations(observations: any, downloadType: String) {
    console.log(downloadType);
    const flatMappedData = observations.flatMap(
        (item: { [x: string]: any; Observations: any[] }) =>
            item.Observations.map((observation) => ({
                iotId: item["@iot.id"],
                observationIotId: observation["@iot.id"],
                result: observation.result,
                resultTime: observation.resultTime,
            }))
    );
    if(downloadType ==="csv"){
        const header = "iotId, observationId, resultTime, result";
        const csvContent =  flatMappedData
            .map(
                (observation: {
                    iotId: number;
                    observationIotId: number;
                    resultTime: string | null;
                    result: string | null;
                }) => {
                    const { iotId, observationIotId, resultTime, result } = observation;
                    return `${iotId || "null"},${observationIotId || "null"},${resultTime || "null"},${result || "null"}`;
                }
            )
            .join("\n");
        const csvData = `${header}\n${csvContent}`;
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
        saveAs(blob, "observations.csv");
    } else if(downloadType === "json") {
        const jsonContent = JSON.stringify(flatMappedData, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8" });
        saveAs(blob, "observations.json");
    }
}


function ChartGraphComparison({ dataStreams, setComparisonList }: any) {
	Chart.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);
	const [selectedDataStreams, setSelectedDataStreams] = useState(dataStreams);
    const [downloadType, setDownloadType] = useState("csv");

	function removeDataStream(iotId: string) {
		const updatedDataStreams = selectedDataStreams.filter(
			(dataStream: any) => dataStream['@iot.id'] !== iotId
		);
		setSelectedDataStreams(updatedDataStreams);
		setComparisonList(updatedDataStreams);
	}

	console.log('dataStreams:', dataStreams);
	console.log('selectedDataStreams:', selectedDataStreams);


	const chartData: any = {
		labels: [],
		datasets: [],
	};

	selectedDataStreams.forEach((datastream: any) => {

		// add labels
		chartData.labels = datastream.Observations.map((observation: any) => observation.resultTime);

		// add dataset
		chartData.datasets.push({
			label: datastream['@iot.id'],
			data: datastream.Observations.map((observation: any) => observation.result),
			fill: false,
			borderColor: randomizeBorderColor(),
			tension: 0.1,
		});
	});

	const options = {
		scales: {
			x: {
				title: {
					display: true,
					text: 'Result Time',
				},
			},
			y: {
				title: {
					display: true,
					text: 'Result',
				},
			},
		},
	};
	return (
		<div style={{ display: "flex" }}>
			
			<div>
				{selectedDataStreams.length > 0 ? (
					<div>
						<div style={{ display: "flex" }}>
							<button
								onClick={() =>
									exportObservations(
										selectedDataStreams,
										downloadType
									)
								}
							>
								Save observations as
							</button>
							<select
								value={downloadType}
								onChange={(e) =>
									setDownloadType(e.target.value)
								}
							>
								<option value="csv">CSV</option>
								<option value="json">JSON</option>
							</select>
						</div>
						<h3>Selected Data Streams:</h3>
						<ul>
							{selectedDataStreams.map((dataStream: any) => (
								<li key={dataStream.name}>
									<p>Name: {dataStream.name}</p>
									<p>Iot.id: {dataStream["@iot.id"]}</p>
									<p>desc: {dataStream.description}</p>
									<button
										onClick={() =>
											removeDataStream(
												dataStream["@iot.id"]
											)
										}
									>
										Remove
									</button>
								</li>
							))}
						</ul>
					</div>
				) : (
					<p>No data streams selected.</p>
				)}
			</div>
			<div style={{ width: "75%" }}>
				<Line data={chartData} options={options} />
			</div>
		</div>
	);
}

export default ChartGraphComparison;
