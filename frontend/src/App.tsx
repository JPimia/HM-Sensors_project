import React, { useState } from 'react';
import { DatastreamContent } from './components/DatastreamContents';
import  SensorsList  from './components/SensorsList';
import PopupComponent from './components/PopupComponent';
import ChartGraphComparison from './components/chartGraphComparisons';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import SensorPage from './components/sensorPage';
import RegisterComponent from './components/RegisterPopUp';
import GitLabAuth from './components/GitLabAuth';

function App() {
	const [selectedDatastream, setSelectedDatastream] = useState(null);
	const [selectedSensors, setSelectedSensors] = useState([]);
	const [datastreamComparisonList, setDatastreamComparisonList] = useState(
		[]
	);
    const [user, setUser] = useState(null);

	return (
		<Router>
			<div>
				<div style={ { display: 'flex', marginBottom: '20px' } }>
                {
                //<GitLabAuth setUser={setUser}/>
                }
					<PopupComponent />
					<Link
						to="/register"
						style={ { backgroundColor: 'yellow' } }
					>
                        Register
					</Link>
				</div>
				<div style={ { display: 'flex', marginBottom: '20px' } }>
					<Link to="/">Home view</Link>
					<Link
						to="/graphComparison"
						style={ { backgroundColor: 'green' } }
					>
                        Graph Comparison
					</Link>
				</div>
			</div>

			<Routes>
				<Route
					path="/"
					element={ (
						<div style={ { display: 'flex' } }>
							<div
								style={ {
									width: '25%',
									height: '100%',
									overflowY: 'scroll',
								} }
							>
								<SensorsList
									setSelectedDatastream={ setSelectedDatastream }
									setDatastreamComparisonList={
										setDatastreamComparisonList
									}
									selectedSensors={ selectedSensors }
									setSelectedSensors={ setSelectedSensors }
								/>
							</div>
							<div style={ { width: '75%' } }>
								{selectedDatastream && (
									<DatastreamContent
										datastream={ selectedDatastream }
									/>
								)}
							</div>
						</div>
					) }
				/>

				<Route
					path="/graphComparison"
					element={ (
						<ChartGraphComparison
							dataStreams={ datastreamComparisonList }
							setComparisonList={ setDatastreamComparisonList }
						/>
					) }
				/>
				<Route
					path="/register"
					element={ (
						<RegisterComponent/>
					) }
				/>
				<Route path="/sensor/:sensorName" element={ <SensorPage /> } />
			</Routes>
		</Router>
	);
}

export default App;
