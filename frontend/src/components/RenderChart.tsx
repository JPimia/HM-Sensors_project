import React from 'react';
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

type Observation = {
	resultTime: string;
	result: number;
};

type RenderChartProps = {
	observations: Observation[];
	unitOfMeasurement: any;
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

export function RenderChart({ observations, unitOfMeasurement }: RenderChartProps) {
	const chartContainer = useRef(null);
	if (!observations) {
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
	console.log("chartData");
	console.log(observations);
	const chartData: ChartData = {
		labels: observations.map((observation: Observation) => observation.resultTime),
		datasets: [
			{
				label: 'Observation Results',
				data: observations.map((observation: Observation) => observation.result),
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
					text: `Result (${unitOfMeasurement.symbol})`,
				},
			},
		},
	};
	return (
		<>
			<h3>Chart:</h3>
			<div ref={chartContainer}>
				<Line data={chartData} options={options} />
			</div>
		</>
	);
}
