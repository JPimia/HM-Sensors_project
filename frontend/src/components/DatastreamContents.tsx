import React, { Key, useContext, useEffect, useState, memo, useMemo, useRef } from "react";
import { fetchObservations } from "./fetches";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import { RenderChart } from "./RenderChart";
import { exportObservations } from "./exportObservations";
import { SensorContext } from "../App";
import "../CSS/ObservationButtons.css";

registerLocale("de", de);
setDefaultLocale("de");

function DatastreamContent() {
	const {
		selectedDatastream
	} = useContext(SensorContext)!;
	const { name, description, unitOfMeasurement, ObservedProperty } = selectedDatastream;
	// Wrap observations in a similar object as the response for fetchObservations
	const [observations, setObservations] = useState({ value: selectedDatastream.Observations, "@iot.nextLink": null });
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [resultAmount, setResultAmount] = useState(20);
	const [nextLink, setNextLink] = useState<undefined | null>();
	const [downloadType, setDownloadType] = useState("csv");
	const firstUpdate = useRef(true);

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}
		const handleFetch = async () => {
			try {
				const response = await fetchObservations(
					selectedDatastream["@iot.id"],
					resultAmount,
					startDate,
					endDate,
					nextLink
				);
				if (response) {
					console.log("Fetching observations")
					setObservations(response);
				}
			} catch (error) {
				console.log(error);
			}
		};
		handleFetch();

	}, [selectedDatastream, nextLink]);


	const renderChartMemo = useMemo(() => {
		if (!observations.value) {
			return null;
		}
		return (
			<RenderChart
				observations={observations.value}
				unitOfMeasurement={unitOfMeasurement}
			/>
		);
	}, [observations.value]);


	const observationList = useMemo(() => {
		if (observations === undefined) {
			return null;
		}
		try {
			return observations.value.map(
				(
					observation: any,
					index: Key | null | undefined
				) => (
					<div
						key={index}
						style={{
							display: "inline-block",
							marginRight: "10px",
							marginTop: "10px",
							marginBottom: "10px",
							marginLeft: "0px",
							padding: "10px",
							border: "1px solid gray",
							borderRadius: "10px",
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
	}, [observations]);

	return (
		<>
			<div style={{ display: "flex", width: "100%", paddingLeft: "10px" }}>
				<div style={{ width: "50%" }}>
					<h3>Datastream</h3>
					<p>Name: {name} id: {selectedDatastream["@iot.id"]}</p>
					<p>Description: {description}</p>
					<p>
						Unit of Measurement: {unitOfMeasurement.name} (
						{unitOfMeasurement.symbol})
					</p>
					<p>Observed Property: {ObservedProperty.name}</p>
					<p>
						Definition:{" "}
						<a href={ObservedProperty.definition}>
							{ObservedProperty.definition.length > 25
								? ObservedProperty.definition.substring(0, 25) + "..."
								: ObservedProperty.definition}
						</a>
					</p>
					<p>Description: {ObservedProperty.description}</p>
				</div>
				<div style={{ width: "50%" }}>
					<h3>Observations</h3>
					<div>
						<span style={{ marginBottom: '5px' }}>Show results from selected date onwards. Doesn't apply if empty. </span>
						<br />
						<DatePicker
							selected={endDate}
							onChange={(date: Date | null) => setEndDate(date)}
							dateFormat="yyyy-MM-dd HH:mm:ss"
							timeInputLabel="Time:"
							showTimeInput
							placeholderText="2000-01-01 00:00:00"
							className="input"
						/>
					</div>
					<div>
						<span style={{ marginBottom: '5px' }}>Show results until selected date.</span>
						<br />
						<DatePicker
							selected={startDate}
							onChange={(date: Date | null) => setStartDate(date!)}
							dateFormat="yyyy-MM-dd HH:mm:ss"
							timeInputLabel="Time:"
							showTimeInput
							className="input"
						/>
						<button onClick={() => setStartDate(new Date())} className="button">
							Set to current time
						</button>
					</div>
					<span style={{ marginBottom: '5px' }}>Amount of results to show per page:</span>
					<br />
					<input
						type="number"
						placeholder="20"
						value={resultAmount}
						onChange={(e) => setResultAmount(parseInt(e.target.value))}
						className="input"
					/>

					<button onClick={() => {
						setNextLink(null)
					}} className="button">
						Fetch observations
					</button>
					<br />
					<p>Next page will show next n resuls</p>
					<div style={{ display: 'flex' }}>
						<button onClick={() => {
							setNextLink(observations["@iot.nextLink"])
						}} className="button" style={{ marginLeft: "-1px" }}>
							Show next page
						</button>
						<div style={{ display: "flex" }} >
							<button onClick={() => exportObservations(observations, downloadType)} className="button" style={{ marginLeft: "-1px" }}>
								Save observations as
							</button>
							<select
								value={downloadType}
								onChange={(e) => setDownloadType(e.target.value)
								} className="select">
								<option value="csv">CSV</option>
								<option value="json">JSON</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div style={{ overflowX: "scroll", whiteSpace: "nowrap", marginLeft: "10px" }}>
					{observationList}
				</div>
				{renderChartMemo}
			</div>
		</>
	);
}


export { DatastreamContent };
