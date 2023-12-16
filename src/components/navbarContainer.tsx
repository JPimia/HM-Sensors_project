import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from '../images/SensorLogo.png';
import { SensorContext } from '../App';
import GitLabAuth from './GitLabAuth';

export function NavbarContainer(): JSX.Element {
	const {
		datastreamComparisonList,
		selectedSensors,
	} = useContext(SensorContext)!;

	const [blinkGraphComparison, setBlinkGraphComparison] = useState(false);
	const [blinkDownload, setBlinkDownload] = useState(false);

	useEffect(() => {
		setBlinkGraphComparison(true);
		setTimeout(() => setBlinkGraphComparison(false), 2000);
	}, [datastreamComparisonList.length]);

	useEffect(() => {
		setBlinkDownload(true);
		setTimeout(() => setBlinkDownload(false), 2000);
	}, [selectedSensors.length]);

	return (
		<div>
			<Navbar className='custom-navbar'>
				<Navbar.Brand href="/" className='brand'>
					<img
						src={logo}
						width={300}
						alt="Sensor Logo" />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link as={Link} to="/" className="buttons">Sensor explorer</Nav.Link>
						<Nav.Link as={Link} to="/graphComparison" className={`buttons ${blinkGraphComparison ? 'blink' : ''}`}>Graph Comparison {datastreamComparisonList.length}</Nav.Link>
						<Nav.Link as={Link} to="/selectedDataset" className={`buttons ${blinkDownload ? 'blink' : ''}`}>Download {selectedSensors.length}</Nav.Link>
						<Nav.Link as={Link} to="/HmBatteries" className="buttons">Quick: HM Sensor batteries</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				{
					// Only show login option if the user has added the enviromental values
					process.env.REACT_APP_GITLAB_CLIENT_ID ? (
						<div>
							<GitLabAuth />
						</div>
					) : null
				}
			</Navbar>
		</div>
	);
}
