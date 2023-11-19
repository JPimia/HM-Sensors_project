import React, { useState } from 'react';
import PopupComponent from './components/PopupComponent';
import ChartGraphComparison from './components/chartGraphComparisons';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SensorPage from './components/sensorPage';
import RegisterComponent from './components/RegisterPopUp';
import GitLabAuth from './components/GitLabAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/Navbar.css';
import './App.css';
import './CSS/Filter.css';
import { HomeComponent } from './components/HomeComponent';
import { navbarContainer } from './components/navbarContainer';



// App.tsx
function App() {
	const [selectedDatastream, setSelectedDatastream] = useState(null);
	const [selectedSensors, setSelectedSensors] = useState<any[]>([]);
	const [datastreamComparisonList, setDatastreamComparisonList] = useState<any[]>([]);
	const [user, setUser] = useState(null);

	const homeComponentProps = {
		selectedDatastream,
		setSelectedDatastream,
		selectedSensors,
		setSelectedSensors,
		setDatastreamComparisonList,
	};

	return (
		<Router>
			{navbarContainer()}
			<Routes>
				<Route path="/" element={<HomeComponent {...homeComponentProps} />} />
				<Route path="/login" element={<PopupComponent />} />
				<Route
					path="/graphComparison"
					element={
						<ChartGraphComparison
							dataStreams={datastreamComparisonList}
							setComparisonList={setDatastreamComparisonList}
						/>
					}
				/>
				<Route path="/register" element={<RegisterComponent />} />
				<Route path="/sensor/:sensorName" element={<SensorPage />} />
			</Routes>
		</Router>
	);
}

export default App;
