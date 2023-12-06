import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchObservations, fetchSensors } from './fetches';
import '../CSS/MobileSensorPage.css';


interface UnitOfMeasurement {
	name: string;
	symbol: string;
	definition: string;
}

interface ObservedArea {
	type: string;
	coordinates: number[];
}

interface Datastream {
	observations: any;
	'@iot.id': number;
	name: string;
	description: string;
	observationType: string;
	unitOfMeasurement: UnitOfMeasurement;
	observedArea: ObservedArea;
	phenomenonTime: string;
	resultTime: string;
}

interface SensorData {
	'@iot.id': number;
	name: string;
	description: string;
	encodingType: string;
	metadata: string;
	Datastreams: Datastream[];
}


function MobileSensorPage() {
	const { sensorName } = useParams<{ sensorName: string }>();
	const [sensor, setSensor] = useState<SensorData | null>(null);


	useEffect(() => {
		async function fetchSensorData() {
			try {
				const data = await fetchSensors(sensorName!);
				let newSensorData = { ...data.value[0] }; // Create a new object from the sensor data

				// Fetch observations for each datastream
				if (newSensorData.Datastreams) {
					for (let datastream of newSensorData.Datastreams) {
						const observations = await fetchObservations(datastream['@iot.id'], 1);
						datastream.observations = observations.value;
						console.log(observations)
					}
				}

				setSensor(newSensorData);
			} catch (error) {
				console.error('Error fetching sensor data', error);
			}
		}
		fetchSensorData();
	}, []);


	const renderDatastreamComponents = () => {
		if (!sensor || !sensor.Datastreams) {
			return <div>Loading datastreams...</div>;
		}

		return sensor.Datastreams.map((datastream) => (
			<div key={datastream['@iot.id']} className="sensor-info">
				<h2 className="sensor-name">{datastream.name}</h2>
				<p>ID: {datastream['@iot.id']}</p>
				<p>{datastream.description}</p>
				<p>Observation Type: {datastream.observationType}</p>
				<p>Unit of Measurement: {datastream.unitOfMeasurement.name}</p>
				{datastream.observations && datastream.observations[0] && (
					<>
						<p>Result Time: {new Date(datastream.observations[0].resultTime).toString()}</p>
						<p>Last result: {datastream.observations[0].result}</p>
					</>
				)}
			</div>
		));
	};

	return (
		sensor ? (
			<div className="mobilepage-sensors-container">
				<h1 className="sensor-name">{sensor.name}</h1>
				<p>ID: {sensor['@iot.id']}</p>
				<p>{sensor.description}</p>
				<div>
					{renderDatastreamComponents()}
				</div>
			</div>
		) : (
			<div>Loading sensor...</div>
		)
	);
}

export default MobileSensorPage;
