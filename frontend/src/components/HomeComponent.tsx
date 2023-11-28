import React, { useContext, useState } from 'react';
import { DatastreamContent } from './DatastreamContents';
import SensorsList from './SensorsList';
import PopupComponent from './PopupComponent';
import { SensorContext } from '../App';


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
			<div style={{ display: "flex" }}>
				<div>
					<SensorsList />
				</div>
				<div style={{ overflowY: "hidden", overflowX: "scroll" }}>
					{selectedDatastream ? (
						<DatastreamContent />
					) : (
						<div>
							<p>Welcome to HM InsightHub!</p>
							<p>
								Welcome to HM InsightHub: Empowering Your Campus
								with Data-Driven Insights Unlock the power of
								data with HM InsightHub, your centralized access
								point for customizing and exporting real-time
								sensor data from across the university. Whether
								you're an academic or student, the tools for
								applied research and sustainability at your
								fingertips.
							</p>
							<p>
								Enhance research and course content with
								real-world data, fostering a data-driven
								academic environment.
							</p>
							<p>How to get started:</p>
							<p>
								1. Fetch a list of available sensors on the
								left. In the search bar, type in “hm sensor” and
								click “Fetch Sensors”.  
							</p>
							<p>
                                2. Select the variables
								you would like to download and customize your
								dataset. Click the ”Download” button in the
								ribbon on the top of the page and further filter
								your data there if you need to.
							</p>
                            <p>
                                3. Review the
								output table and download your file. Select your
								desired file format (csv or JSON) and download
								the file
							</p>
                            <p>Ready to Explore? Dive into the Data Now!</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
