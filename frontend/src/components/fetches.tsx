/* 
	FROST-server documentation, parameters etc.
	https://fraunhoferiosb.github.io/FROST-Server/ 
*/


async function fetchUrl(url: string): Promise<any> {
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.log('Failed URL:', url);
		throw new Error('Failed to fetch URL: ' + error);
	}
}


async function fetchSensor(name: string): Promise<any> {

	const url = `https://gi3.gis.lrg.tum.de/frost/v1.1/Sensors?
		$filter=name eq '${name}'&
		$expand=Datastreams`;

	const response = await fetchUrl(url);
	return response;
}


// Fetch a list of sensors using name as filter,
async function fetchSensors(name?: string, timeFrame?: string, location?: any): Promise<any> {

	let filterOptions = '';

	if (name) {
		filterOptions = '$filter=';
	}

	if (name) {
		filterOptions += `substringof(tolower('${name}'),tolower(name))&`;
	}

	if (timeFrame) {
		// TODO: Add filter for timeFrame
	}

	if (location) {
		// TODO: Add filter for location
	}

	const url = `https://gi3.gis.lrg.tum.de/frost/v1.1/Sensors?
	${filterOptions}
	$top=10&
	$expand=Datastreams`;

	const response = await fetchUrl(url);
	return response;
}


// Fetch contents of datastream using datastream -> '@iot.selfLink'
async function fetchDatastreamContents(datastream: string): Promise<any> {
	const url = `${datastream}?
	$select=name,description,observationType,unitOfMeasurement,@iot.id,Observations&
	$expand=ObservedProperty,Observations($top=20;$orderby=resultTime%20desc)
	`;

	const response = await fetchUrl(url);
	return response;
}


// TODO: make startdate optional, default should not use timeframes
async function fetchObservations(id: number, resultAmount: number, startDate: Date, endDate?: Date | null, nextUrl?: string | null): Promise<any> {
	// Returns {value:[],@iot.nextLink:string}

	const formattedStartDate = startDate.toISOString();
	const formattedEndDate = endDate ? endDate.toISOString() : null;
	// Use nextUrl if it exists
	let url = nextUrl ? nextUrl : `
	https://gi3.gis.lrg.tum.de/frost/v1.1/Datastreams(${id})/Observations?
	$top=${resultAmount}
	&$select=resultTime,result
	&$orderby=resultTime+desc
	&$filter=resultTime+le+${formattedStartDate}
	`;


	if (endDate) {
		url += `+and+resultTime+ge+${formattedEndDate}`;
	}
	try {
		const response = fetchUrl(url);
		return response;
	} catch (error) {
		//
	}



}

export { fetchSensors, fetchDatastreamContents, fetchSensor, fetchObservations };
