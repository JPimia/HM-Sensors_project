import React, { useContext, useEffect, useState } from 'react';
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
import { SensorContext } from '../App';
import "../CSS/Filter.css";
import "../CSS/GraphComparison.css";

function randomizeBorderColor() {
	const red = Math.floor(Math.random() * 256);
	const green = Math.floor(Math.random() * 256);
	const blue = Math.floor(Math.random() * 256);
	return `rgb(${red}, ${green}, ${blue})`;
}


function ChartGraphComparison() {
	Chart.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);
	const { datastreamComparisonList, setDatastreamComparisonList } = useContext(SensorContext)!;
	const [coloredComparisonList, setColoredComparisonList] = useState<any>([]);

	// Adds a random color to each datastream for the graph elements
	useEffect(() => {
		const updatedDatastreamComparisonList = datastreamComparisonList.map(datastream => {
			return { ...datastream, color: randomizeBorderColor() };
		});
		setColoredComparisonList(updatedDatastreamComparisonList);
	}, []);

	function removeDataStream(iotId: string) {
		// Remove from chart
		const updatedDataStreams = coloredComparisonList.filter(
			(dataStream: any) => dataStream['@iot.id'] !== iotId
		);
		setColoredComparisonList(updatedDataStreams)
		// Remove from comparisonList
		const updatedComparisonList = datastreamComparisonList.filter(
			(dataStream: any) => dataStream['@iot.id'] !== iotId
		);
		setDatastreamComparisonList(updatedComparisonList);
	}

	const chartData: any = {
		labels: [],
		datasets: [],
	};

	coloredComparisonList.forEach((datastream: any) => {
		// add labels
		chartData.labels = datastream.Observations.map((observation: any) => {
			let date = new Date(observation.resultTime);
			let formattedDate = date.toLocaleString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
			return formattedDate;
		});
		// add dataset
		chartData.datasets.push({
			label: datastream['@iot.id'],
			data: datastream.Observations.map((observation: any) => observation.result),
			fill: false,
			borderColor: datastream.color, // use the stored color if it exists, otherwise generate a new one
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
		<div style={{ display: "flex" }} className='main-container'>
			{datastreamComparisonList.length > 0 ? (
				<div style={{ display: "flex", flexDirection: "column" }}>
					<ul className='sensors-container2' style={{ overflowY: "scroll" }}>
						{datastreamComparisonList.map((dataStream: any) => (
							<li key={dataStream["@iot.id"] + dataStream.name} className='sensor-info'>
								<p>Name: {dataStream.name}</p>
								<p>Iot.id: {dataStream["@iot.id"]}</p>
								<p>desc: {dataStream.description}</p>
								<button
									onClick={() =>
										removeDataStream(
											dataStream["@iot.id"]
										)
									}
									className='red-graph-button'
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

			<div className='graph-container'>
				<Line data={chartData} options={options} />
			</div>
		</div>
	);
}

export default ChartGraphComparison;
