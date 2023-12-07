import React, { useEffect, useState } from 'react';
import { ResponseType, fetchHmBatteries } from './fetches';
import '../CSS/MobileSensorPage.css';

function HmBatteries() {
	const [sensorData, setSensorData] = useState<ResponseType | null>(null);
	const [loadingStartTime, setLoadingStartTime] = useState<Date | null>(null);

	useEffect(() => {
		async function fetchSensorData() {
			setLoadingStartTime(new Date());
			try {
				const data = await fetchHmBatteries();
				setSensorData(data);
				setLoadingStartTime(null);
			} catch (error) {
				console.error('Error fetching sensor data', error);
				setLoadingStartTime(null);
			}
		}
		fetchSensorData();
	}, []);

	function renderDatastreamComponents() {
		if (!sensorData) {
			const elapsedTime = loadingStartTime ? Math.floor((new Date().getTime() - loadingStartTime.getTime()) / 1000) : 0;
			return <p>Loading sensors... {Math.floor(elapsedTime / 60)}:{elapsedTime % 60 < 10 ? '0' : ''}{elapsedTime % 60}</p>;
		}

		//Sort sensors by battery level (lowest on top)
		const sortedSensors = [...sensorData.value].sort((a, b) => {
			const aValue = a.Datastreams[0]?.Observations[0]?.result || Infinity;
			const bValue = b.Datastreams[0]?.Observations[0]?.result || Infinity;
			return aValue - bValue;
		});
		const validSensors = sortedSensors.filter(sensor => sensor.Datastreams[0]?.Observations[0]?.result !== undefined);
		const invalidSensors = sortedSensors.filter(sensor => sensor.Datastreams[0]?.Observations[0]?.result === undefined);

		// Function to render a list of sensors
		const renderSensors = (sensors: any) => (
			<div>
				{sensors.map((sensor: any) => (
					<div key={sensor.name}>
						<h2>{sensor.name}</h2>
						{sensor.Datastreams.map((datastream: any) => (
							<div key={datastream['@iot.id']}>
								<p>Result: {datastream.Observations[0]?.result ? `${datastream.Observations[0].result} mV` : 'No data available'}</p>
								<p>Time: {datastream.Observations[0]?.resultTime ? new Date(datastream.Observations[0].resultTime).toString() : 'No time available'}</p>
							</div>
						))}
					</div>
				))}
			</div>
		);

		return (
			<div style={{ display: 'flex' }}>
				<div>
					<h2>Valid sensors:</h2>
					{renderSensors(validSensors)}</div>
				<div>
					<h2>Invalid sensors:</h2>
					{renderSensors(invalidSensors)}</div>
			</div>
		);
	}

	return (
		<>
			<h1>Hm sensor battery statuses</h1>
			<p>Sorted: Lowest battery on top</p>
			{renderDatastreamComponents()}
		</>
	);
}

export default HmBatteries;