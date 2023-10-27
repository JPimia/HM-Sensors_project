async function fetchUrl(url: string): Promise<any> {
	try {
		const response = await fetch(url);
		const data = await response.json();
		console.log('Response:', data);
		return data;
	} catch (error) {
		console.log('Failed URL:', url);
		throw new Error('Failed to fetch URL: ' + error);
	}
}

/* 
	FROST-server documentation, parameters etc.
	https://fraunhoferiosb.github.io/FROST-Server/ 
*/

// Fetch a list of sensors using name as filter,
// TODO: PAGING use @iot.nextLink to get similar data for next sensor if using top=1;
async function fetchSensors(nameFilter: string): Promise<any> {
	const url =`https://gi3.gis.lrg.tum.de/frost/v1.1/Sensors?
        $top=10&
        $filter=substringof(tolower('${nameFilter}'),tolower(name))&
        $select=name,description&
        $expand=Datastreams(
            $select=name,description,@iot.selfLink)`;

    const response = await fetchUrl(url);
	return response;
}


// Fetch contents of datastream using datastream -> '@iot.selfLink'
// TODO: PAGING use @iot.nextLink if using top=1;
async function fetchDatastreamContents(datastream: {[key: string]: any;}): Promise<any> {
	if (datastream['@iot.selfLink']) {

        let url = `${datastream['@iot.selfLink']}?
        $select=name,description,observationType,unitOfMeasurement&
        $expand=ObservedProperty,Observations(
            $select=resultTime,result;
            $orderby=phenomenonTime desc;
            $top=20)`

		const response = await fetchUrl(url);
		return response;
	}
};


export {fetchSensors, fetchDatastreamContents};
