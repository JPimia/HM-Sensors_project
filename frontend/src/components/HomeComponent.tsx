import React from 'react';
import { DatastreamContent } from './DatastreamContents';
import SensorsList from './SensorsList';
import PopupComponent from './PopupComponent';


type HomeComponentProps = {
    selectedDatastream: any;
    setSelectedDatastream: React.Dispatch<React.SetStateAction<any>>;
    selectedSensors: any[];
    setSelectedSensors: React.Dispatch<React.SetStateAction<any[]>>;
    setDatastreamComparisonList: React.Dispatch<React.SetStateAction<any[]>>;
};

export function HomeComponent(props: HomeComponentProps) {
    const {
        selectedDatastream, setSelectedDatastream, selectedSensors, setSelectedSensors, setDatastreamComparisonList,
    } = props;

    return (
        <div className='main-container'>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
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
                    style={{
                        width: '25%',
                        height: '100%',
                        overflowY: 'scroll',
                    }}
                >
                    <SensorsList
                        setSelectedDatastream={setSelectedDatastream}
                        setDatastreamComparisonList={setDatastreamComparisonList}
                        selectedSensors={selectedSensors}
                        setSelectedSensors={setSelectedSensors} />
                </div>
                <div style={{ width: '75%' }}>
                    {selectedDatastream && (
                        <DatastreamContent
                            datastream={selectedDatastream} />
                    )}
                </div>
            </div>
        </div>
    );
}
