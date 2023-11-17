import React from 'react';
import { useState } from 'react';
import { fetchSensors, fetchDatastreamContents } from './fetches';
import '../CSS/SensorList.css'; 

export default function SensorsList({ setSelectedDatastream,
	setDatastreamComparisonList,
	setSelectedSensors,
	selectedSensors, }: any) {

	const [sensorName, setSensorName] = useState('hm sensor');
	const [locationName, setLocationName] = useState('locationtest');
	const [timeframe, setTimeframe] = useState('2021-01-01/2023-11-05');
	const [compareType, setCompareType] = useState(null);


	async function handleCompareBtnClick(datastream: { [key: string]: any; }) {
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
			const data = await fetchSensors(name, timeframe, locationName);
			setSelectedSensors(data.value);
		} catch (error) {
			console.error(error);
		}
	}


	async function getDatastream(datastream: { [key: string]: any; }) {
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

	function InputFields(): any {
		return (
			<div>
				<h4>Filter options:</h4>
				<input
					type="text"
					value={sensorName}
					onChange={(e) => setSensorName(e.target.value)} />
				<span>Sensor Name</span>
				<br />
				<input
					type="text"
					value={locationName}
					onChange={(e) => setLocationName(e.target.value)} />
				<span>Location Name</span>
				<br />
				<button onClick={() => getSensors(sensorName, timeframe, locationName)}>Fetch Sensors</button>
			</div>
		);

	}
	return (
		<div>
			{InputFields()}
			<br />
			{selectedSensors ? ( // Check if filter returned any results
				<div style={{
					height: '100vh',
					overflowY: 'auto' // Add scrollbars when the content overflows
				}}>
					{selectedSensors.map((sensor: any) => (
						<div className="sensor-container" key={sensor.name}>
							<div key={sensor.name}>
								<div className='sensor-info'>
									<h3 className='sensor-name'>{sensor.name}</h3>
									<p>Sensor ID: {sensor['@iot.id']}</p>
									<p>Description: {sensor.description}</p>
								</div>
								{sensor.Datastreams.map((datastream: any) => (
									<div key={datastream.name} className='button-container'>
										<button
											onClick={() => getDatastream(datastream)}
											className='red-button'
										>
											{datastream.name}
										</button>
										<button
											onClick={() => handleCompareBtnClick(datastream)}
											className='green-button'
											style={{
												backgroundColor: isCompareBtnDisabled(
													datastream.name,
													compareType
												)
													? 'gray'
													: 'green',
											}}
											disabled={isCompareBtnDisabled(
												datastream.name,
												compareType
											)}
										>
											Add to compare
										</button>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<p>No sensors found</p>
			)}
		</div>
	);
}
