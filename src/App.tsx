import React, { createContext, useState, useContext, ReactNode, Dispatch, FC, SetStateAction, useEffect } from 'react';
import ChartGraphComparison from './components/chartGraphComparisons';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MobileSensorPage from './components/MobileSensorPage';
import GitLabAuth from './components/GitLabAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/Navbar.css';
import './App.css';
import './CSS/Filter.css';
import { HomeComponent } from './components/HomeComponent';
import { NavbarContainer } from './components/navbarContainer';
import DatasetViewer from './components/DatasetViewer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import HmBatteries from './components/HmBatteries';


interface SelectedSensorsState {
	selectedSensors: any[];
	selectedDatastream: any | null;
	datastreamComparisonList: any[];
	user: any | null;
	locationData: any[];
	compareType: string | null
	setSelectedSensors: React.Dispatch<React.SetStateAction<any[]>>;
	setSelectedDatastream: React.Dispatch<React.SetStateAction<any | null>>;
	setDatastreamComparisonList: React.Dispatch<React.SetStateAction<any[]>>;
	setUser: React.Dispatch<React.SetStateAction<any | null>>;
	setLocationData: React.Dispatch<React.SetStateAction<any[]>>;
	setCompareType: React.Dispatch<React.SetStateAction<any | null>>;
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
	const [locationData, setLocationData] = useState<any[]>([]);
	const [compareType, setCompareType] = useState(null);

	return (
		<SensorContext.Provider
			value={{
				selectedDatastream, setSelectedDatastream,
				selectedSensors, setSelectedSensors,
				datastreamComparisonList, setDatastreamComparisonList,
				user, setUser,
				locationData, setLocationData,
				compareType, setCompareType
			}}>
			{children}
		</SensorContext.Provider>
	);
}


function NavbarWithLocation() {
	const location = useLocation();

	if (location.pathname.includes('/mobile/sensor')) {
		return null;
	}

	return <NavbarContainer />;
}

function App() {
	return (
		<SensorProvider>
			<Router>
				<NavbarWithLocation />
				<Routes>
					<Route path="/" element={<HomeComponent />} />
					<Route
						path="/graphComparison"
						element={
							<ChartGraphComparison />
						}
					/>
					<Route path="/selectedDataset" element={
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatasetViewer />
						</LocalizationProvider>
					} />
					<Route path="/hmBatteries" element={<HmBatteries />} />
					<Route path="/mobile/sensor/:sensorName" element={<MobileSensorPage />} />
				</Routes>
			</Router>
		</SensorProvider >
	);
}

export default App;
