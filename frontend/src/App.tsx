import { useState } from "react";
import { DatastreamContent, SensorsList } from "./components/components";
import PopupComponent from "./components/PopupComponent";
import RegisterComponent from "./components/RegisterPopUp";
import ChartGraphComparison from "./components/chartGraphComparisons";

function App() {
	const [selectedDatastream, setSelectedDatastream] = useState(null);
	const [selectedSensors, setSelectedSensors] = useState([]);
	const [datastreamComparisonList, setDatastreamComparisonList] = useState([]);
	const [viewPage, setViewPage] = useState("main");

	function handleViewChange(page: any) {
		setViewPage(page);
	}

	return (
		<>
		<div>
			<div style={{display: "flex", marginBottom: "10px"}}>
                <div style={{margin: "5px"}}>
				    <PopupComponent />
                </div>
                <div style={{margin: "5px"}}>
                    <RegisterComponent />
                </div>
			</div>
			<div style={{ display: "flex", marginBottom: "20px" }}>
				<button onClick={() => handleViewChange("main")} style={{ marginRight: "20px" }}>
				Home view
				</button>
				<button style={{ backgroundColor: 'green' }}
				onClick={() => handleViewChange("graphComparison")}
				>Graph Comparison</button>
			</div>
		</div>


		{viewPage === "main" && (			
			<div style={{ display: "flex" }}>
				<div
					style={{
						width: "25%",
						height: "100%",
						overflowY: "scroll",
					}}
					>
					<SensorsList
						setSelectedDatastream={setSelectedDatastream}
						setDatastreamComparisonList={setDatastreamComparisonList}
						selectedSensors={selectedSensors}
						setSelectedSensors={setSelectedSensors}
					/>
				</div>

				<div style={{ width: "75%" }}>
					{selectedDatastream && (
						<DatastreamContent datastream={selectedDatastream} />
					)}
				</div>
			</div>

		)}
		{viewPage === "graphComparison" && (
			<ChartGraphComparison dataStreams={datastreamComparisonList} setComparisonList={setDatastreamComparisonList}/>
		)}
		</>
	);
}

export default App;
