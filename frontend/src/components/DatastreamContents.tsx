import React, { Key, useEffect, useState } from "react";
import { fetchObservations } from "./fetches";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import { RenderChart } from "./RenderChart";
import { exportObservations } from "./exportObservations";

// Register german locale for datepicker
registerLocale("de", de);
setDefaultLocale("de");

function DatastreamContent({ datastream }: any) {
	const { name, description, unitOfMeasurement, ObservedProperty } = datastream;

	// Reformat observation object to avoid having to re-fetch the data
	const observations = {
		value: datastream.Observations,
		"@iot.nextLink": datastream["Observations@iot.nextLink"],
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
				Definition:{" "}
				<a href={ObservedProperty.definition}>{ObservedProperty.definition}</a>
			</p>
			<p>Description: {ObservedProperty.description}</p>
			<RenderObservations datastreamObservations={observations} unitOfMeasurement={unitOfMeasurement} />
		</div>
	);
}

// Render observations stuff
function RenderObservations(
	{ datastreamObservations, unitOfMeasurement }: { datastreamObservations: any; unitOfMeasurement: any; }) {
	const [observations, setObservations] = useState(datastreamObservations);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [resultAmount, setResultAmount] = useState(20);
	const [nextLink, setNextLink] = useState<undefined | null>();
	const [isFetchObservations, setIsFetchObserevations] = useState(false);
	const [downloadType, setDownloadType] = useState("csv");

	useEffect(() => {
		const handleFetch = async () => {
			try {
				const response = await fetchObservations(
					resultAmount,
					startDate,
					endDate,
					nextLink
				);
				if (response) {
					setObservations(response);
				}
			} catch (error) {
				console.log(error);
			}
		};
		if (isFetchObservations) {
			handleFetch();
			setIsFetchObserevations(false)
		}

	}, [startDate, endDate, nextLink, resultAmount, isFetchObservations]);


	return (
		<>
			<h3>Observations:</h3>
			<span>Filter observations by time (uses GMT +1/Berlin timezone)</span>
			<div style={{ display: "flex" }}>
				<div>
					<p>Start time: </p>
					<DatePicker
						selected={startDate}
						onChange={(date: Date | null) => setStartDate(date!)}
						dateFormat="yyyy-MM-dd HH:mm:ss"
						timeInputLabel="Time:"
						showTimeInput
					/>
				</div>
				<div>
					<p>End time: Doesn't apply if empty</p>
					<DatePicker
						selected={endDate}
						onChange={(date: Date | null) => setEndDate(date)}
						dateFormat="yyyy-MM-dd HH:mm:ss"
						timeInputLabel="Time:"
						showTimeInput
						placeholderText="End Date"
					/>
				</div>
			</div>
			<button onClick={() => setStartDate(new Date())}>
				Set start to current time
			</button>
			<br />
			<button onClick={() => {
				setNextLink(null)
				setIsFetchObserevations(true);
			}}>
				Fetch observations
			</button>
			<br />
			<button onClick={() => {
				setNextLink(observations["@iot.nextLink"])
				setIsFetchObserevations(true);
			}}>
				Show next results ( forward by: )
			</button>{<input
				type="number"
				placeholder="20"
				value={resultAmount}
				onChange={(e) => setResultAmount(parseInt(e.target.value))}
			/>}
			<br />
			<div style={{ display: "flex" }}>
				<button onClick={() => exportObservations(observations, downloadType)}>
					Save observations as
				</button>
				<select
					value={downloadType}
					onChange={(e) => setDownloadType(e.target.value)
					}>
					<option value="csv">CSV</option>
					<option value="json">JSON</option>
				</select>
			</div>
			<div style={{ overflowX: "scroll", whiteSpace: "nowrap" }}>
				<ObservationList observations={observations.value} />
			</div>
			<RenderChart observations={observations.value} unitOfMeasurement={unitOfMeasurement} />
		</>
	);

	function ObservationList({ observations }: { observations: { resultTime: string, result: number }[] }): any {
		try {
			return observations.map(
				(
					observation,
					index: Key | null | undefined
				) => (
					<div
						key={index}
						style={{
							display: "inline-block",
							margin: "10px",
							padding: "10px",
							border: "1px solid gray",
							backgroundColor:
								observation.resultTime === null || observation.result === null
									? "darkred"
									: "none",
						}}
					>
						<p>
							{observation.resultTime !== null
								? observation.resultTime.split("T")[0]
								: "Result Time: null"}
						</p>
						<p>
							{observation.resultTime !== null
								? observation.resultTime.split("T")[1].split(".")[0]
								: "Time: null"}
						</p>
						<p>Result: {observation.result}</p>
					</div>
				)
			);
		} catch (error) {
			console.log(error);
			console.log(observations);
		}
	}
}

export { DatastreamContent };
