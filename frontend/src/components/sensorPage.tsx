import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSensor } from './fetches';

interface SensorContainer {
	value: SensorData[];
}

interface SensorData {
	'@iot.id': string;
	name: string;
	description: string;
	Datastreams: Datastream[];
}

interface Datastream {
	'@iot.id': string;
	name: string;
	description: string;
	// Add more properties as needed
}

function SensorPage() {
	const { sensorName } = useParams<{ sensorName: string }>();
	const [sensor, setSensor] = useState<SensorContainer | null>(null);

	useEffect(() => {
		async function fetchSensorData() {
			try {
				const data = await fetchSensor(sensorName!);
				setSensor(data);
			} catch (error) {
				console.error('Error fetching sensor data', error);
			}
			console.log(sensor);
		}

		fetchSensorData();
	}, []);

	if (!sensor) {
		// You can render a loading indicator here
		return <div>Loading...</div>;
	}

	// Render the sensor information and data here
	return (
		<>
			{sensor.value.map((sensor: SensorData) => (
				<div key={ sensor.name }>
					<h3>{sensor.name}</h3>
					<p>{sensor['@iot.id']}</p>
					<p>{sensor.description}</p>
					<p>Datastreams:</p>
					{sensor.Datastreams.map((datastream: Datastream) => (
						<div key={ datastream.name }>
							<button
								// onClick={() => getDatastream(datastream)}
							>
								{datastream.name}
							</button>
							<button
								// onClick={() => handleCompareBtnClick(datastream)}
								// style={{ backgroundColor: isCompareBtnDisabled(datastream.name, compareType) ? 'gray' : 'green' }}
								// disabled={isCompareBtnDisabled(datastream.name, compareType)}
							>
								Add to compare
							</button>
						</div>
					))}
				</div>
			))}
		</>
	);
}

export default SensorPage;
