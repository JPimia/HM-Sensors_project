import {  Key } from "react";
import {useState, useRef } from 'react';
import {fetchSensors, fetchDatastreamContents} from './fetches';
import {Line} from 'react-chartjs-2';
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



function DatastreamContent({datastream}: any) {
	Chart.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);
	const chartContainer = useRef(null);

	const {name, description, unitOfMeasurement, ObservedProperty, Observations} = datastream;
	const observationResults = Observations.map(
		(observation: { result: any; }) => observation.result
		);
	const observationTimes = Observations.map(
		(observation: { resultTime: any; }) => observation.resultTime
		);
	const data = {
		labels: observationTimes,
		datasets: [
			{
				label: 'Observation Results',
				data: observationResults,
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
		<div>
			<p>Name: {name}</p>
			<p>Description: {description}</p>
			<p>Unit of Measurement: {unitOfMeasurement.name} ({unitOfMeasurement.symbol})</p>
			<p>Observed Property: {ObservedProperty.name}</p>
			<p>Observed Property Definition: <a href={ObservedProperty.definition}>{ObservedProperty.definition}</a></p>
			<p>Observed Property Description: {ObservedProperty.description}</p>

			<h3>Observations:</h3>
			<div style={{overflowX: 'scroll', whiteSpace: 'nowrap'}}>
				{Observations.map((observation: { resultTime: string; result: string | number | null | undefined; }, index: Key) => (
					<div
						key={index}
						style={{
							display: 'inline-block',
							margin: '10px',
							padding: '10px',
							border: '1px solid gray',
						}}>
						<p>Result Time: </p>
						<p>{observation.resultTime.split('T')[0]}</p>
						<p>{observation.resultTime.split('T')[1].split('.')[0]}</p>
						<p>Result: {observation.result} {unitOfMeasurement.symbol}</p>
					</div>
				))}
			</div>
			<h3>Chart:</h3>
			<div ref={chartContainer}>
				<Line data={data} options={options} />
			</div>
		</div>
	);
};


function SensorsList({ setSelectedDatastream }: any) {
	const [sensorName, setSensorName] = useState('hm sensor');
	const [sensors, setSensors] = useState([]);
	
	
	async function getSensors(name: string) {
		try {
			const data = await fetchSensors(name);
			setSensors(data.value);
			setSelectedDatastream(null); // Reset selected datastream when fetching new sensors
		} catch (error) {
			console.error(error);
		}
	}


	async function getDatastream(datastream: { [key: string]: any; }) {
		try {
			const data = await fetchDatastreamContents(datastream);
			setSelectedDatastream(data);
		} catch (error) {
			console.error(error);
		}
	}


	return(
		<div style={{width: '25%', height: '100%', overflowY: 'scroll'}}>
			<input type="text" value={sensorName} onChange={(e) => setSensorName(e.target.value)} />
			<button onClick={() => getSensors(sensorName)}>
		Fetch Sensors
			</button>

			{sensors.map((sensor:any) => (
				<div key={sensor.name}>
					<h3>{sensor.name}</h3>
					<p>{sensor.description}</p>
					<p>Datastreams:</p>
					{sensor.Datastreams.map((datastream: { [x: string]: any; name?: any; }) => (
						<button
							key={datastream.name}
							onClick={() => getDatastream(datastream)}
						>
							{datastream.name}
						</button>
					))}
				</div>
			))}
		</div>
	)
}




export {DatastreamContent, SensorsList};