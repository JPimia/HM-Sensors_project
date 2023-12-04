import React, { useContext } from 'react';
import { useState, useEffect, memo } from 'react';
import { fetchSensors, fetchDatastreamContents, fetchSensorNames, fetchUrl, fetchSensor } from './fetches';
import '../CSS/SensorList.css';
import { useNavigate } from 'react-router-dom';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import { SensorContext } from '../App';
import "../CSS/InputContainer.css";

registerLocale("de", de);
setDefaultLocale("de");

export default function SensorsList() {
	const { setSelectedSensors, setSelectedDatastream, setDatastreamComparisonList, selectedSensors, user } = useContext(SensorContext)!;
	const [compareType, setCompareType] = useState(null);
	const navigate = useNavigate(); // Use useNavigate instead of useHistory

	async function handleCompareBtnClick(datastream: { [key: string]: any }) {
		const fullDatastream = await fetchDatastreamContents(datastream['@iot.selfLink']);
		setCompareType(datastream.name);
		setDatastreamComparisonList((prevList: any) => [...prevList, fullDatastream]);
	}

	async function getSensors(name?: string, timeframe?: string, locationName?: String, locations?: any, filter?: string, dropdown?: boolean) {
		try {
			const data = await fetchSensors(name, dropdown);
			let sensorsWithLocations = data.value.map((sensor: { name: any; }) => {
				// Looks for the corresponding location based on sensorName
				const matchingLocation = locations.find((location: { sensorName: any; }) => location.sensorName === sensor.name);
				if (matchingLocation) {
					return {
						...sensor,
						Room: matchingLocation.Room,
						Faculty: matchingLocation.Faculty,
					};
				}

				// If no matching location is found, return the sensor as is
				return sensor;
			});
			if (filter && filter !== "Any") {
				sensorsWithLocations = sensorsWithLocations.filter((sensor: { Faculty: string; }) => sensor.Faculty === filter);
			}

			sensorsWithLocations.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
			if (user) {
				setSelectedSensors(sensorsWithLocations);
			} else {
				setSelectedSensors(data.value);
			}
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

	const InputFields = memo(function InputFields(): any {
		const sensorNameRef = React.useRef<HTMLInputElement>(null);
		const locationNameRef = React.useRef<HTMLInputElement>(null);
		const timeframeRef = React.useRef<HTMLInputElement>(null);
		const [sensorNames, setSensorNames] = useState([]);
		const [userInput, setUserInput] = useState('');
		const [suggestions, setSuggestions] = useState([]);
		const [locations, setLocations] = useState<any[]>([]);
		const [faculties, setFaculties] = useState<any[]>([]);
		const [filter, setFilter] = useState('Any');
        const [dropdownOpen, setDropdownOpen] = useState(false);


		const handleInputChange = () => {
			const input = sensorNameRef.current?.value || '';
			setUserInput(input);

			const filteredSuggestions = sensorNames.filter((name: string) =>
				name.toLowerCase().includes(input.toLowerCase())
			);

			setSuggestions(filteredSuggestions);
		};

		const handleSuggestionClick = (suggestion: string) => {
			setSuggestions([]);
			setUserInput(suggestion);
			getSensors(
				suggestion,
				timeframeRef.current?.value,
				locationNameRef.current?.value,
				locations,
				filter,
                true
			)
		};

		useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                const dropdownContainer = document.querySelector('.dropdown-container');
          
                if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
                  setDropdownOpen(false);
                }
              };
          
              document.addEventListener('click', handleClickOutside);
            
			const handleFetch = async () => {
				try {
					const sensorNameObject = await fetchSensorNames();
					const sensorNameArray = sensorNameObject.value.map((item: { name: any; }) => item.name);
					setSensorNames(sensorNameArray);
					const locationDataJson = await fetchUrl("https://suzbt4f677.execute-api.eu-central-1.amazonaws.com/alpha/userInfoFunction");
					const locationDataObject = JSON.parse(locationDataJson.body);
					const cleanedDataArray = locationDataObject.map((item: { sensorName: string; }) => {
						// Remove '\n' from the 'sensorName' property that was added to some of them accidentally
						item.sensorName = item.sensorName.replace(/\n/g, '');
						return item;
					});
					setLocations(cleanedDataArray);
					const facultyArray: string[] = [];
					cleanedDataArray.forEach((item: { Faculty: string }) => {
						if (!facultyArray.includes(item.Faculty)) {
							facultyArray.push(item.Faculty);
						}
					});
					facultyArray.sort();
					setFaculties(facultyArray);
				} catch (error) {
					console.log(error);
				}
			};
			handleFetch();

            return () => {
                document.removeEventListener('click', handleClickOutside);
              };
		}, []);

        const toggleDropdown = () => {
            setDropdownOpen(!dropdownOpen);
          };

		return (
			<div className="input-container">
				<h4>Sensor explorer</h4>
				<p>
					Search for sensors using name as filter, leave empty to show
					all.
				</p>
				<div className="dropdown-container">
                    <div style={{display: 'flex', height: 32}}>
                        <input
                            type="text"
                            ref={sensorNameRef}
                            value={userInput}
                            onChange={handleInputChange}
                            placeholder="Type to search..."
<<<<<<< HEAD
                            onClick={toggleDropdown}
=======
							className='input'
>>>>>>> ec0e5bb1677055a707c3954c33ac1c8c5f512a47
                        />
                        <button
                            onClick={() =>
                                getSensors(
                                    sensorNameRef.current?.value,
                                    timeframeRef.current?.value,
                                    locationNameRef.current?.value,
                                    locations,
                                    filter,
                                    false
                                )
                            }
                            className="input-container-red-button"
                        >
                            Search
                        </button>
                    </div>
                    {dropdownOpen && (
          <ul className="dropdown-list">
            {suggestions.slice(0, 10).map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
				</div>
				{/*
						original search input field
						<input
							type="text"
							ref={sensorNameRef}
							defaultValue="hm sensor"
						/>
					*/}

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
				{user ? (
					<div className="filter-container">
						<p style={{marginRight: 25}}>Filter results based on the faculty:</p>
						<select
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
                            style={{height: 30}}
						>
							<option value="Any">Any</option>
							{faculties.map((faculty, index) => (
								<option
									key={index}
									onClick={() => setFilter(faculty)}
								>
									{faculty}
								</option>
							))}
						</select>
					</div>
				) : null}
			</div>
		);
	});

	return (
		<div style={{ display: 'flex', flexDirection: "column", width: "25%" }}>
			<InputFields />
			{selectedSensors ? (
				<div className='sensors-container'>
					{selectedSensors.map((sensor: any) => (
						<div className="sensor-container" key={sensor['@iot.id']}>
							<div key={sensor.name}>
								<div className='sensor-info'>
									<h3 className='sensor-name'>{sensor.name}</h3>
									<span style={{ marginBottom: '5px' }}>Sensor ID: {sensor['@iot.id']}</span>
									<span style={{ marginBottom: '5px' }}>Description: {sensor.description}</span>
									{sensor.Room && (
										<>
											<span style={{ marginBottom: '5px' }}>Faculty: {sensor.Faculty}</span>
											<span style={{ marginBottom: '5px' }}>Room: {sensor.Room}</span>
										</>
									)}
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
