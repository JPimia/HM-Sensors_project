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
	
	const chartData = {
		labels: Observations.map((observation: any) => observation.resultTime),
		datasets: [
			{
				label: 'Observation Results',
				data: Observations.map((observation: any) => observation.result),
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
				<Line data={chartData} options={options} />
			</div>
		</div>
	);
};


function SensorsList({ setSelectedDatastream, setDatastreamComparisonList , setSelectedSensors, selectedSensors}: any) {
	const [sensorName, setSensorName] = useState('hm sensor');
	
	const [compareType, setCompareType] = useState(null);
	
	async function handleCompareBtnClick(datastream: { [key: string]: any; }) {
		const fullDatastream = await fetchDatastreamContents(datastream['@iot.selfLink']);
		setCompareType(datastream.name);
		setDatastreamComparisonList((prevList: any) => [...prevList, fullDatastream]);
	}


	async function getSensors(name: string) {
		try {
			const data = await fetchSensors(name);
			setSelectedSensors(data.value);
		} catch (error) {
			console.error(error);
		}
	}


	async function getDatastream(datastream: { [key: string]: any; }) {
		try {
			const data = await fetchDatastreamContents(datastream['@iot.selfLink']);
			setSelectedDatastream(data);
		} catch (error) {
			console.error(error);
		}
	}

	function isCompareBtnDisabled(datastreamType: string, compareType: string | null):boolean {
		if (compareType === null) {
			return false
		} else { 
			return datastreamType !== compareType}
	}

	return(
		<div>
			<input type="text" value={sensorName} onChange={(e) => setSensorName(e.target.value)} />
			<button onClick={() => getSensors(sensorName)}>
		Fetch Sensors
			</button>

			{selectedSensors.map((sensor:any) => (
				<div key={sensor.name}>
					<h3>{sensor.name}</h3><p>{sensor['@iot.id']}</p>
					<p>{sensor.description}</p>
					<p>Datastreams:</p>
					{sensor.Datastreams.map((datastream: any) => (
						<div key={datastream.name}>
					<button
						onClick={() => getDatastream(datastream)}
					>
						{datastream.name}
					</button>
					<button
						onClick={() => handleCompareBtnClick(datastream)}
						style={{ backgroundColor: isCompareBtnDisabled(datastream.name, compareType) ? 'gray' : 'green' }}
						disabled={isCompareBtnDisabled(datastream.name, compareType)}
					>
						Add to compare
					</button>
				</div>
					))}
				</div>
			))}
		</div>
	)
}




export {DatastreamContent, SensorsList};