import { Key, useEffect } from 'react';
import React from 'react';
import { useState, useRef } from 'react';
import { fetchSensors, fetchDatastreamContents, fetchObservations } from './fetches';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import de from 'date-fns/locale/de';
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
import { saveAs } from 'file-saver';

// Register german locale for datepicker
registerLocale('de', de);
setDefaultLocale('de');

function DatastreamContent({ datastream }: any) {
	const {
		name,
		description,
		unitOfMeasurement,
		ObservedProperty,
	} = datastream;

	
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
				Definition:{' '}
				<a href={ ObservedProperty.definition }>
					{ObservedProperty.definition}
				</a>
			</p>
			<p>Description: {ObservedProperty.description}</p>
			{RenderObservations(datastream)}
		</div>
	);
}

function exportObservationsToCSV(observations:any) {
	// Create a CSV content string
	const header = 'resultTime, result, observationId';
	const csvContent = observations.map((observation: { resultTime: string | null; result: string | null; observationId: any; }) => {
		const { resultTime, result, observationId } = observation;
		return `${resultTime || 'null'},${result || 'null'},${observationId || 'null'}`;
	}).join('\n');
	const csvData = `${header}\n${csvContent}`;
	const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
	saveAs(blob, 'observations.csv');
}

function RenderChart(observations: any[], unitOfMeasurement:any) {
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
	if (!observations) {
		throw new Error('Observations cannot be null or undefined');
	}
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
					text: `Result (${unitOfMeasurement})`,
				},
			},
		},
	};
	return(
		<>
			<h3>Chart:</h3>
			<div ref={ chartContainer }>
				<Line data={ chartData } options={ options } />
			</div>
		</>
	);
}




// Render observations stuff
function RenderObservations(datastream:any) {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [observations, setObservations] = useState(datastream.Observations);
	const [nextLink, setNextLink] = useState();

	useEffect(() => {
		const handleFetch = async () => {
			try {
				const response = await fetchObservations(startDate, endDate, nextLink);
				console.log(response['@iot.nextLink']);
				if (response.value) {
					setObservations(response.value);
				}
			} catch (error) {
				console.log(error);
			}
		};
		handleFetch();
	}, [startDate, nextLink]);

	return (
		<>
			<h3>Observations:</h3>
			<span>Filter observations by time (uses GMT +1/Berlin timezone)</span>
			<div style={ { display: 'flex' } }>
				<div>
					<p>Start time: </p>
					<DatePicker
						selected={ startDate }
						onChange={ (date: Date | null) => setStartDate(date!) }
						dateFormat="yyyy-MM-dd HH:mm:ss"
						timeInputLabel="Time:"
						showTimeInput />
				</div>
				<div>
					<p>End time: Doesn't apply if empty</p>
					<DatePicker
						selected={ endDate }
						onChange={ (date: Date | null) => setEndDate(date) }
						dateFormat="yyyy-MM-dd HH:mm:ss"
						timeInputLabel="Time:"
						showTimeInput
						placeholderText="End Date" />
				</div>
			</div>
			<button onClick={ () => setStartDate(new Date()) }>Set start to current time</button>
			<br />
			<br />
			<button onClick={ () => setNextLink(observations['@iot.nextLink']) }>More results</button>
			<button onClick={ () => exportObservationsToCSV(observations) }>Save observations as CSV</button>
			<div style={ { overflowX: 'scroll', whiteSpace: 'nowrap' } }>
				{datastream.Observations.map((observation: { resultTime: string | null; result: string | null; observationId: any; }, index: Key | null | undefined) => (
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
						<p>Result: {observation.result}</p>
					</div>
				))}
			</div>
			{RenderChart(observations,datastream.unitOfMeasurement)}
		</>

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
				<div style={ {
					height: '100vh', // Set the height to the height of the screen
					overflowY: 'auto' // Add scrollbars when the content overflows
				} }>
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
