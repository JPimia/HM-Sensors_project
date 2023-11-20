import React, { useContext } from 'react';
import { useState } from 'react';
import { fetchSensors, fetchDatastreamContents } from './fetches';
import '../CSS/SensorList.css';
import { Link } from 'react-router-dom';

import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import { SensorContext } from '../App';
registerLocale("de", de);
setDefaultLocale("de");

export default function SensorsList() {
	const { setSelectedSensors, setSelectedDatastream, setDatastreamComparisonList, selectedSensors } = useContext(SensorContext)!;

	const [compareType, setCompareType] = useState(null);//TODO: Move to app.tsx


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
		const [startDate, setStartDate] = useState(new Date());
		const sensorNameRef = React.useRef<HTMLInputElement>(null);
		const locationNameRef = React.useRef<HTMLInputElement>(null);
		const timeframeRef = React.useRef<HTMLInputElement>(null);

		return (
			<div className='input-container'>
				<h4>Filter options:</h4>
				<span>Sensor Name</span>
				<input
					type="text"
					ref={sensorNameRef}
					defaultValue="hm sensor"
				/>

				{/* 				<span>Location Name</span>
				<input
					type="text"
					ref={locationNameRef}
					defaultValue="locationtest"
				/> */}

				{/* 				<div>
					<div>
						<p>Start time: Will show sensors that have recorded activity since specified time</p>
						<DatePicker
							selected={startDate}
							onChange={(date: Date | null) => setStartDate(date!)}
							dateFormat="yyyy-MM-dd HH:mm:ss"
							timeInputLabel="Time:"
							showTimeInput
						/>
					</div>
				</div> */}
				<button onClick={() => getSensors(sensorNameRef.current?.value, timeframeRef.current?.value, locationNameRef.current?.value)} className='buttons' style={{ width: '100%' }}>Fetch Sensors</button>
				<Link to="/graphComparison">
					<button className='buttons' style={{ backgroundColor: 'green', width: '100%' }}>
						Graph Comparison
					</button>
				</Link>
			</div>
		);

	}
	return (
		<div>
			<InputFields />
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
