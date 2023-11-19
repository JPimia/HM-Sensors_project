import React, { createContext, useState, useContext, ReactNode, Dispatch, FC, SetStateAction } from 'react';
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
import { NavbarContainer } from './components/navbarContainer';


interface SelectedSensorsState {
	selectedSensors: any[];
	selectedDatastream: any | null;
	datastreamComparisonList: any[];
	user: any | null;
	setSelectedSensors: React.Dispatch<React.SetStateAction<any[]>>;
	setSelectedDatastream: React.Dispatch<React.SetStateAction<any | null>>;
	setDatastreamComparisonList: React.Dispatch<React.SetStateAction<any[]>>;
	setUser: React.Dispatch<React.SetStateAction<any | null>>;
}

export const SensorContext = createContext<SelectedSensorsState | undefined>(undefined);

interface SensorProviderProps {
	children: ReactNode;
}

function SensorProvider({ children }: SensorProviderProps) {
	const [selectedDatastream, setSelectedDatastream] = useState<any | null>(null);
	const [selectedSensors, setSelectedSensors] = useState<any[]>([]);
	const [datastreamComparisonList, setDatastreamComparisonList] = useState<any[]>([]);
	const [user, setUser] = useState<any | null>(null);

	return (
		<SensorContext.Provider
			value={{
				selectedDatastream, setSelectedDatastream,
				selectedSensors, setSelectedSensors,
				datastreamComparisonList, setDatastreamComparisonList,
				user, setUser
			}}>
			{children}
		</SensorContext.Provider>
	);
}


// App.tsx
function App() {

	return (
		<SensorProvider>
			<Router>
				<NavbarContainer />
				<Routes>
					<Route path="/" element={<HomeComponent />} />
					<Route path="/login" element={<PopupComponent />} />
					<Route
						path="/graphComparison"
						element={
							<ChartGraphComparison />
						}
					/>
					<Route path="/register" element={<RegisterComponent />} />
					<Route path="/sensor/:sensorName" element={<SensorPage />} />
				</Routes>
			</Router>
		</SensorProvider >
	);

}

export default App;
