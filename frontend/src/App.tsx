import React, { useState } from 'react';
import { DatastreamContent } from './components/DatastreamContents';
import  SensorsList  from './components/SensorsList';
import PopupComponent from './components/PopupComponent';
import ChartGraphComparison from './components/chartGraphComparisons';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import SensorPage from './components/sensorPage';
import RegisterComponent from './components/RegisterPopUp';
import GitLabAuth from './components/GitLabAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from './SensorLogo.png'
import './CSS/Navbar.css';





function App() {
	const [selectedDatastream, setSelectedDatastream] = useState(null);
	const [selectedSensors, setSelectedSensors] = useState([]);
	const [datastreamComparisonList, setDatastreamComparisonList] = useState([]);
    const [user, setUser] = useState(null);

	//en saanu navbar login nappia toimiin niinku pitäs
	//const [isPopupVisible, setIsPopupVisible] = useState(false);

	return (
		<Router>
			<div>
				<Navbar className='custom-navbar'>
					<Navbar.Brand href="/" className='brand'>
						<img
							src={logo}
							width={300}
							alt="Sensor Logo"
						/></Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link href="/" className="buttons">Home</Nav.Link>
						<Nav.Link href="/graphComparison" className="buttons">Graph Comparison</Nav.Link>
						<Nav.Link href="/register"  className="buttons">Register</Nav.Link>
						{/* <Nav.Link onClick={() => setIsPopupVisible(!isPopupVisible)}>Login</Nav.Link> */}
					</Nav>
					</Navbar.Collapse>

					<NavDropdown 
						title="Dropdown"
						id="basic-nav-dropdown"
						className="custom-dropdown">
						
						<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.2">
							Another action
						</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.3">
							Something
						</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item href="#action/3.4">
							Log out
						</NavDropdown.Item>
					</NavDropdown>

				</Navbar>
				{/* {isPopupVisible && <PopupComponent/>} */}
			</div>
			<Routes>
				<Route
					path="/"
					element={(
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
						
					</div>
					)}
				/>
				<Route path="/login" element={<PopupComponent />} />
				
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
