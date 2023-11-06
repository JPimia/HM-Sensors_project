/* eslint-disable @typescript-eslint/no-explicit-any */
import { Key } from 'react';
import React from 'react';
import { useState, useRef } from 'react';
import { fetchSensors, fetchDatastreamContents } from './fetches';
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

function DatastreamContent({ datastream }: any) {
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

	const {
		name,
		description,
		unitOfMeasurement,
		ObservedProperty,
		Observations,
	} = datastream;

	const chartData = {
		labels: Observations.map((observation: any) => observation.resultTime),
		datasets: [
			{
				label: 'Observation Results',
				data: Observations.map(
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
		<div>
			<p>Name: {name}</p>
			<p>Description: {description}</p>
			<p>
				Unit of Measurement: {unitOfMeasurement.name} (
				{unitOfMeasurement.symbol})
			</p>
			<p>Observed Property: {ObservedProperty.name}</p>
			<p>
				Observed Property Definition:{' '}
				<a href={ ObservedProperty.definition }>
					{ObservedProperty.definition}
				</a>
			</p>
			<p>Observed Property Description: {ObservedProperty.description}</p>

			<h3>Observations:</h3>
			<div style={ { overflowX: 'scroll', whiteSpace: 'nowrap' } }>
				{RenderObservations(Observations,unitOfMeasurement)}
			</div>
			<h3>Chart:</h3>
			<div ref={ chartContainer }>
				<Line data={ chartData } options={ options } />
			</div>
		</div>
	);
}

// Render scrollable list of observations for datastreamcontent
function RenderObservations(Observations:any, unitOfMeasurement:any) {
	
	function flagBadObservation() {
		//TODO: send request to backend for toggling bad data flag of observation
	}

	return (
		<div>
			{Observations.map((observation: { resultTime: string | null; result: string | null; observationId: any; }, index: Key | null | undefined) => (
				<div
					key={ index }
					style={ {
						display: 'inline-block',
						margin: '10px',
						padding: '10px',
						border: '1px solid gray',
						backgroundColor: observation.resultTime === null || observation.result === null ? 'darkred' : 'none',
					} }
				>
					<p>{observation.resultTime !== null ? observation.resultTime.split('T')[0] : 'Result Time: null'}</p>
					<p>{observation.resultTime !== null ? observation.resultTime.split('T')[1].split('.')[0] : 'Time: null'}</p>
					<p>Result: {observation.result !== null ? observation.result + ' ' + unitOfMeasurement.symbol : 'Result: null'}</p>
					<button onClick={ () => flagBadObservation() }>
					Flag data
					</button>
				</div>
			))}
		</div>
	);
}


function SensorsList({
	setSelectedDatastream,
	setDatastreamComparisonList,
	setSelectedSensors,
	selectedSensors,
}: any) {
	const [sensorName, setSensorName] = useState('hm sensor');
	const [locationName, setLocationName] = useState('locationtest');
	const [timeframe, setTimeframe] = useState('2021-01-01/2023-11-05');
	const [compareType, setCompareType] = useState(null);


	async function handleCompareBtnClick(datastream: { [key: string]: any }) {
		const fullDatastream = await fetchDatastreamContents(
			datastream['@iot.selfLink']
		);
		setCompareType(datastream.name);
		setDatastreamComparisonList((prevList: any) => [
			...prevList,
			fullDatastream,
		]);
	}


	async function getSensors(name?: string, timeframe?: string, locationName?: string) {
		try {
			const data = await fetchSensors(name,timeframe,locationName);
			setSelectedSensors(data.value);
		} catch (error) {
			console.error(error);
		}
	}


	async function getDatastream(datastream: { [key: string]: any }) {
		try {
			const data = await fetchDatastreamContents(
				datastream['@iot.selfLink']
			);
			setSelectedDatastream(data);
		} catch (error) {
			console.error(error);
		}
	}

	
	function isCompareBtnDisabled(
		datastreamType: string,
		compareType: string | null
	): boolean {
		if (compareType === null) {
			return false;
		} else {
			return datastreamType !== compareType;
		}
	}

	function InputFields():any {
		return(
			<div>
				<h4>Filter options:</h4>
				<input
					type="text"
					value={ sensorName }
					onChange={ (e) => setSensorName(e.target.value) }
				/>
				<span>Sensor Name</span>
				<br />
				<input
					type="text"
					value={ timeframe }
					onChange={ (e) => setTimeframe(e.target.value) }
				/>
				<span>Timeframe</span>
				<br />
				<input
					type="text"
					value={ locationName }
					onChange={ (e) => setLocationName(e.target.value) }
				/>
				<span>Location Name</span>
				<br />
				<button onClick={ () => getSensors(sensorName,timeframe,locationName) }>Fetch Sensors</button>
			</div>
		);
	
	}
	return (
		<div>
			{InputFields()}
			<br/>
			{selectedSensors ? ( // Check if filter returned any results
				<div>
					{selectedSensors.map((sensor: any) => (
						<div key={ sensor.name }>
							<h3>{sensor.name}</h3>
							<p>{sensor['@iot.id']}</p>
							<p>{sensor.description}</p>
							<p>Datastreams:</p>
							{sensor.Datastreams.map((datastream: any) => (
								<div key={ datastream.name }>
									<button
										onClick={ () =>
											getDatastream(datastream)
										}
									>
										{datastream.name}
									</button>
									<button
										onClick={ () =>
											handleCompareBtnClick(datastream)
										}
										style={ {
											backgroundColor:
												isCompareBtnDisabled(
													datastream.name,
													compareType
												)
													? 'gray'
													: 'green',
										} }
										disabled={ isCompareBtnDisabled(
											datastream.name,
											compareType
										) }
									>
										Add to compare
									</button>
								</div>
							))}
						</div>
					))}
				</div>
			) : (
				<p>No sensors found</p>
			)}
		</div>
	);
}

export { DatastreamContent, SensorsList };
