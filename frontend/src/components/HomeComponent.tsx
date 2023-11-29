import React, { useContext, useState } from 'react';
import { DatastreamContent } from './DatastreamContents';
import SensorsList from './SensorsList';
import PopupComponent from './PopupComponent';
import { SensorContext } from '../App';
import '../CSS/LandingPage.css';


export function HomeComponent() {
    const {
        selectedDatastream
    } = useContext(SensorContext)!;


    return (
		<div className="main-container">
			<div style={{ display: "flex" }}>
				{
					//<GitLabAuth setUser={setUser}/>
				}
				<PopupComponent />
				{/* <Link
                to="/register"
                style={ { backgroundColor: 'yellow' } }
            >
                Register
            </Link> */}
			</div>
			<div style={{ display: "flex", marginBottom: "0px" }}>
				{/* <Link to="/">Home view</Link>
            <Link
                to="/graphComparison"
                style={ { backgroundColor: 'green' } }
            >
                Graph Comparison
            </Link> */}
			</div>
				<SensorsList />
				<div style={{ overflowY: "scroll", overflowX: "hidden", width: "100%", paddingRight: "10px" }}>
					{selectedDatastream ? (
						<DatastreamContent />
					) : (
						<div className='landing-text' style={{marginLeft: "10px"}}>
							<h1><center>Welcome to HM InsightHub!</center></h1><br/><br/>
							<p>
								<strong>Welcome to HM InsightHub: Empowering Your Campus with Data-Driven Insights.</strong> <br/> Unlock the power of
								data with HM InsightHub, your centralized access
								point for customizing and exporting real-time
								sensor data from across the university. <br/> Whether
								you're an academic or student, the tools for
								applied research and sustainability at your
								fingertips.
							</p>
							<p>
								Enhance research and course content with
								real-world data, fostering a data-driven
								academic environment.
							</p> <br/>
							
							<h4>How to get started:</h4> <br/>
							
								<p>
								1.  <strong>Fetch a list of available sensors on the
									left.</strong> <br/>&nbsp;&nbsp;&nbsp; In the search bar, type in “hm sensor” and
									click “Fetch Sensors”.
								</p>
								<p>
								2.  <strong>Select the variables
									you would like to download and customize your
									dataset.</strong> <br/>&nbsp;&nbsp;&nbsp; Click the ”Download” button in the
									ribbon on the top of the page and further filter
									your data there if you need to.
								</p>
								<p>
								3.  <strong>Review the
									output table and download your file.</strong> <br/>&nbsp;&nbsp;&nbsp; Select your
									desired file format (csv or JSON) and download
									the file.
								</p> <br/>
								<p><strong>Ready to Explore? Dive into the Data Now!</strong></p>
							
                            
						</div>
					)}
				</div>
			
		</div>
	);
}
