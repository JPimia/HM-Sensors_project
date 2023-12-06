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

async function fetchSensorNames(): Promise<any> {
	try {
		// Fetches 1000 sensor names
		const response = await fetch("https://gi3.gis.lrg.tum.de/frost/v1.1/Sensors?$select=name&$top=1000");
		const data = await response.json();
		return data;
	} catch (error) {
		throw new Error('Failed to fetch URL: ' + error);
	}
}


async function fetchSensors(name?: string, dropdown?: boolean): Promise<any> {

	let filterOptions = '';

	if (dropdown) {
		filterOptions = `$filter=name eq '${name}'&`;
	} else {
		filterOptions += `$filter=substringof(tolower('${name}'),tolower(name))&$top=1000&`;
	}

	const url = `https://gi3.gis.lrg.tum.de/frost/v1.1/Sensors?
	${filterOptions}
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




async function fetchObservations(id: number, resultAmount: number, startDate?: Date | null, endDate?: Date | null, nextUrl?: string | null): Promise<any> {
	// Returns {value:[],@iot.nextLink:string}
	// startDate 1/1/2000 and endDate 2/1/2000 will return values between the dates

	const formattedStartDate = startDate ? startDate.toISOString() : null;
	const formattedEndDate = endDate ? endDate.toISOString() : null;
	// Use nextUrl if it exists
	let url = nextUrl ? nextUrl : `
	https://gi3.gis.lrg.tum.de/frost/v1.1/Datastreams(${id})/Observations?
	$top=${resultAmount}
	&$select=resultTime,result
	&$orderby=resultTime+desc
	`;

	// Add filter if startDate or endDate is defined
	if (startDate || endDate) {
		url += '&$filter=';
		if (startDate) url += `resultTime+le+${formattedStartDate}`;
		if (endDate) url += (startDate ? '+and+' : '') + `resultTime+ge+${formattedEndDate}`;
	}
	try {
		const response = fetchUrl(url);
		return response;
	} catch (error) {

		console.error(`Error fetching observations: ${error}`);
	}

}

export { fetchSensors, fetchDatastreamContents, fetchObservations, fetchSensorNames, fetchUrl };
