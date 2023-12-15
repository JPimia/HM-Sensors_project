import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../images/SensorLogo.png';
import { SensorContext } from '../App';
import GitLabAuth from './GitLabAuth';

export function NavbarContainer(): JSX.Element {
	const {
		datastreamComparisonList
	} = useContext(SensorContext)!;

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
						<Nav.Link as={Link} to="/graphComparison" className="buttons">Graph Comparison {datastreamComparisonList.length}</Nav.Link>
						<Nav.Link as={Link} to="/selectedDataset" className="buttons">Download</Nav.Link>
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
