import React, { useContext } from 'react';
import { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
import { SensorContext } from '../App';

type Observation = {
	resultTime: string;
	result: number;
};


type ChartDataset = {
	label: string;
	data: number[];
	fill: boolean;
	borderColor: string;
	tension: number;
};

type ChartData = {
	labels: string[];
	datasets: ChartDataset[];
};

export function RenderChart() {
	const {
		selectedDatastream
	} = useContext(SensorContext)!;
	const chartContainer = useRef(null);
	if (!selectedDatastream) {
		console.log('observations is undefined');
		return <p>No observations selected</p>;
	}
	Chart.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);

	const chartData: ChartData = {
		labels: selectedDatastream.Observations.map((observation: any) => {
			let date = new Date(observation.resultTime);
			let formattedDate = date.toLocaleString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
			return formattedDate;
		}),
		datasets: [
			{
				label: 'Observation Results',
				data: selectedDatastream.Observations.map((observation: Observation) => observation.result),
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
			},
		],
	};

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
					text: `Result (${selectedDatastream.unitOfMeasurement.symbol})`,
				},
			},
		},
	};
	return (
		<>
			<div ref={chartContainer}>
				<Line data={chartData} options={options} />
			</div>
		</>
	);
}
