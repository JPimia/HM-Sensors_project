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


function randomizeBorderColor() {
	const red = Math.floor(Math.random() * 256);
	const green = Math.floor(Math.random() * 256);
	const blue = Math.floor(Math.random() * 256);

	return `rgb(${red}, ${green}, ${blue})`;
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

	function removeDataStream(iotId: string) {
		const updatedDataStreams = selectedDataStreams.filter(
			(dataStream: any) => dataStream['@iot.id'] !== iotId
		);
		setSelectedDataStreams(updatedDataStreams);
		setComparisonList(updatedDataStreams);
	}

	console.log("dataStreams:", dataStreams);
	console.log("selectedDataStreams:", selectedDataStreams);


const chartData: any = {
	labels: [],
	datasets: [],
};

selectedDataStreams.forEach((datastream: any) => {

	// add labels
	chartData.labels = datastream.Observations.map((observation: any) => observation.resultTime);

	// add dataset
	chartData.datasets.push({
	label: datastream["@iot.id"],
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
				text: `Result`,
			},
		},
	},
};
	return (
		<div style={{ display: "flex" }}>
			<div>
				{selectedDataStreams.length > 0 ? (
					<div>
						<h3>Selected Data Streams:</h3>
						<ul>
							{selectedDataStreams.map((dataStream: any) => (
							<li key={dataStream.name}>
								<p>Name: {dataStream.name}</p>
								<p>Iot.id: {dataStream['@iot.id']}</p>
								<p>desc: {dataStream.description}</p>
								<button onClick={() => removeDataStream(dataStream['@iot.id'])}>Remove</button>
							</li>
						))}
						</ul>
					</div>
				) : (
					<p>No data streams selected.</p>
			)}
			</div>
			<div style={{ width: "75%" }}>
				<Line data={chartData} options={options}/>
			</div>
		</div>
	);
}

export default ChartGraphComparison;