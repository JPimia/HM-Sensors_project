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

export function RenderChart({ observations, unitOfMeasurement }: RenderChartProps) {
	const chartContainer = useRef(null);
	Chart.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);

	const chartData = {
		labels: observations.map((observation: any) => observation.resultTime),
		datasets: [
			{
				label: 'Observation Results',
				data: observations.map(
					(observation: any) => observation.result
				),
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
