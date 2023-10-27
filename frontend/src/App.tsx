import { useState } from "react";
import { DatastreamContent, SensorsList } from "./components/components";
import PopupComponent from "./components/PopupComponent";

function App() {
    const [selectedDatastream, setSelectedDatastream] = useState(null);

    return (
        <>
            <PopupComponent />
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        width: "25%",
                        height: "100%",
                        overflowY: "scroll",
                    }}
                >
                    <SensorsList
                        setSelectedDatastream={setSelectedDatastream}
                    />
                </div>

                <div style={{ width: "75%" }}>
                    {selectedDatastream && (
                        <DatastreamContent datastream={selectedDatastream} />
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
