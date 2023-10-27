import { useState } from 'react';
import { DatastreamContent, SensorsList} from './components/components';

function App() {
  const [selectedDatastream, setSelectedDatastream] = useState(null);

	return (
		<div style={{display: 'flex'}}>

			<SensorsList setSelectedDatastream={setSelectedDatastream} />

			<div style={{width: '75%'}}>
				{selectedDatastream && (
					<DatastreamContent datastream={selectedDatastream} />
				)}
			</div>
		</div>
	);
}

export default App;
