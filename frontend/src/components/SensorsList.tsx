import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { fetchSensors, fetchDatastreamContents, fetchSensorNames } from './fetches';
import '../CSS/SensorList.css';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import { SensorContext } from '../App';

registerLocale("de", de);
setDefaultLocale("de");

export default function SensorsList() {
	const { setSelectedSensors, setSelectedDatastream, setDatastreamComparisonList, selectedSensors } = useContext(SensorContext)!;
	const [compareType, setCompareType] = useState(null);
	const navigate = useNavigate(); // Use useNavigate instead of useHistory

	async function handleCompareBtnClick(datastream: { [key: string]: any }) {
		const fullDatastream = await fetchDatastreamContents(datastream['@iot.selfLink']);
		setCompareType(datastream.name);
		setDatastreamComparisonList((prevList: any) => [...prevList, fullDatastream]);
	}

	async function getSensors(name?: string, timeframe?: string, locationName?: string) {
		try {
		const data = await fetchSensors(name, timeframe, locationName);
		setSelectedSensors(data.value);
		} catch (error) {
		console.error(error);
		}
	}

	async function getDatastream(datastream: { [key: string]: any }) {
		try {
		const data = await fetchDatastreamContents(datastream['@iot.selfLink']);
		setSelectedDatastream(data);
		} catch (error) {
		console.error(error);
		}
	}

	function isCompareBtnDisabled(datastreamType: string, compareType: string | null): boolean {
		return compareType !== null && datastreamType !== compareType;
	}

	function InputFields(): any {
		const [startDate, setStartDate] = useState(new Date());
		const sensorNameRef = React.useRef<HTMLInputElement>(null);
		const locationNameRef = React.useRef<HTMLInputElement>(null);
		const timeframeRef = React.useRef<HTMLInputElement>(null);
        const [sensorNames, setSensorNames] = useState([]);
        const [userInput, setUserInput] = useState('');
        const [suggestions, setSuggestions] = useState([]);

        
        const handleInputChange = () => {
                const input = sensorNameRef.current?.value || '';
                setUserInput(input);

                const filteredSuggestions = sensorNames.filter((name : string) =>
                    name.toLowerCase().includes(input.toLowerCase())
                );

                setSuggestions(filteredSuggestions);
        };

        const handleSuggestionClick = (suggestion: string) => {
                setSuggestions([]);
                getSensors(
                    suggestion,
                    timeframeRef.current?.value,
                    locationNameRef.current?.value
                )
        };

        useEffect(() => {
            const handleFetch = async () => {
                try {
                    const sensorNameObject = await fetchSensorNames();
                    const sensorNameArray = sensorNameObject.value.map((item: { name: any; }) => item.name);
                    setSensorNames(sensorNameArray);
                } catch (error) {
                    console.log(error);
                }
            };
            handleFetch();
        }, []);
    
		return (
			
			<div className='input-container'>
				<h4>Filter options:</h4>
				<p>Search for sensors using name as filter, leave empty to show all.</p>
				<div className="dropdown-container">
					<input
						type="text"
						ref={sensorNameRef}
						value={userInput}
						onChange={handleInputChange}
						placeholder="Type to search..."
					/>
					<ul className="dropdown-list">
						{
							// Currently only shows the first 10 items in the suggestion array
						}
						{suggestions.slice(0, 10).map((suggestion, index) => (
							<li
								key={index}
								onClick={() => handleSuggestionClick(suggestion)}
							>
								{suggestion}
							</li>
						))}
					</ul>
				</div>
				{
					/*
						original search input field
						<input
							type="text"
							ref={sensorNameRef}
							defaultValue="hm sensor"
						/>
					*/
				}


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
				{/* <input
					type="text"
					ref={sensorNameRef}
					defaultValue="hm sensor"
				/> */}
				<div className='input-container-buttons'>
					<button onClick={() => getSensors(sensorNameRef.current?.value, timeframeRef.current?.value, locationNameRef.current?.value)} className='input-container-red-button' style={{ marginTop: "10px", marginBottom: "10px" }}>
						Fetch Sensors
					</button>
					<button onClick={() => navigate('/graphComparison')} className='input-container-green-button'>
						Graph Comparison
					</button>
				</div>
			</div>
		);
	}

	return (
		<div>
		<InputFields />
		{selectedSensors ? (
			<div className='sensors-container'>
			{selectedSensors.map((sensor: any) => (
				<div className="sensor-container" key={sensor.name}>
				<div key={sensor.name}>
					<div className='sensor-info'>
					<h3 className='sensor-name'>{sensor.name}</h3>
					<span style={{ marginBottom: '5px' }}>Sensor ID: {sensor['@iot.id']}</span>
					<span style={{ marginBottom: '5px' }}>Description: {sensor.description}</span>
					</div>
					{sensor.Datastreams.map((datastream: any) => (
					<div key={datastream.name} className='button-container'>
						<button onClick={() => getDatastream(datastream)} className='red-button'>
						{datastream.name}
						</button>
						<button
						onClick={() => handleCompareBtnClick(datastream)}
						className='green-button'
						style={{
							backgroundColor: isCompareBtnDisabled(datastream.name, compareType) ? 'gray' : 'green',
						}}
						disabled={isCompareBtnDisabled(datastream.name, compareType)}
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
