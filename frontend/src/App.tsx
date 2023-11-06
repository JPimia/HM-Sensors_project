import React, { useState } from 'react';
import { DatastreamContent, SensorsList } from './components/components';
import PopupComponent from './components/PopupComponent';
import ChartGraphComparison from './components/chartGraphComparisons';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SensorPage from './components/sensorPage';

function App() {
	const [selectedDatastream, setSelectedDatastream] = useState(null);
	const [selectedSensors, setSelectedSensors] = useState([]);
	const [datastreamComparisonList, setDatastreamComparisonList] = useState(
		[]
	);

	return (
		<Router>
			<div>
				<div>
					<PopupComponent />
				</div>
				<div style={{ display: 'flex', marginBottom: '20px' }}>
					<Link to="/">Home view</Link>
					<Link
						to="/graphComparison"
						style={{ backgroundColor: 'green' }}
					>
                        Graph Comparison
					</Link>
				</div>
			</div>

			<Route
				exact
				path="/"
				render={() => (
					<div style={{ display: 'flex' }}>
						<div
							style={{
								width: '25%',
								height: '100%',
								overflowY: 'scroll',
							}}
						>
							<SensorsList
								setSelectedDatastream={setSelectedDatastream}
								setDatastreamComparisonList={
									setDatastreamComparisonList
								}
								selectedSensors={selectedSensors}
								setSelectedSensors={setSelectedSensors}
							/>
						</div>
						<div style={{ width: '75%' }}>
							{selectedDatastream && (
								<DatastreamContent
									datastream={selectedDatastream}
								/>
							)}
						</div>
					</div>
				)}
			/>

			<Route
				path="/graphComparison"
				render={() => (
					<ChartGraphComparison
						dataStreams={datastreamComparisonList}
						setComparisonList={setDatastreamComparisonList}
					/>
				)}
			/>

			<Route path="/sensor/:sensorName">
				<SensorPage />
			</Route>
		</Router>
	);
}

export default App;
