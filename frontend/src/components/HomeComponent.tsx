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
        <div className='main-container'>
            <div style={{ display: 'flex' }}>
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
            <div style={{ display: 'flex', marginBottom: '0px' }}>
                {/* <Link to="/">Home view</Link>
            <Link
                to="/graphComparison"
                style={ { backgroundColor: 'green' } }
            >
                Graph Comparison
            </Link> */}
            </div>
            <div style={{ display: 'flex' }}>
                <div
                    
                >
                    <SensorsList />
                </div>
                <div style={{  overflowY: "hidden", overflowX: "scroll" }}>
                    {selectedDatastream ? (
                        <DatastreamContent />
                    ) : null}
                </div>
            </div>
        </div>
    );
}
