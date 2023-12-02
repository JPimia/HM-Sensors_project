import React, { useMemo, useContext, useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { SensorContext } from '../App';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';


function DatasetViewer() {
	const { selectedSensors } = useContext(SensorContext)!;
	const [tableContent, setTableContent] = useState<any[]>([]);
	const [filterSelectOptions, setFilterSelectOptions] = useState<{ [key: string]: any[] }>({});

	// Create table content and filter select options
	useEffect(() => {
		let newTableContent: any[] = [];
		let newFilterSelectOptions: any = {
			sensorId: [],
			sensorName: [],
			faculty: [],
			room: [],
			datastreamId: [],
			datastreamName: [],
			unitOfMeasurement: [],
		};

		selectedSensors.forEach((sensor: Sensor) => {
			sensor.Datastreams.forEach((datastream: Datastream) => {
				newTableContent.push({
					sensorId: sensor['@iot.id'],
					sensorName: sensor.name,
					faculty: sensor.Faculty || '',
					room: sensor.Room || '',
					datastreamId: datastream['@iot.id'],
					datastreamName: datastream.name,
					unitOfMeasurement: datastream.unitOfMeasurement.name,
					datastreamDescription: datastream.description,
				});
				newFilterSelectOptions.sensorId.push(sensor['@iot.id']);
				newFilterSelectOptions.sensorName.push(sensor.name);
				newFilterSelectOptions.faculty.push(sensor.Faculty || '');
				newFilterSelectOptions.room.push(sensor.Room || '');
				newFilterSelectOptions.datastreamId.push(datastream['@iot.id']);
				newFilterSelectOptions.datastreamName.push(datastream.name);
				newFilterSelectOptions.unitOfMeasurement.push(datastream.unitOfMeasurement.name);
			});
		});

		setTableContent(newTableContent);

		for (let key in newFilterSelectOptions) {
			newFilterSelectOptions[key] = Array.from(new Set(newFilterSelectOptions[key]));
		}
		setFilterSelectOptions(newFilterSelectOptions);
	}, [selectedSensors]);




	const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
		{
			id: 'sensorId',
			header: 'Sensor ID',
			accessorFn: (row) => row.sensorId,
			filterVariant: 'multi-select',
			filterSelectOptions: filterSelectOptions.sensorId,
		},
		{
			id: 'sensorName',
			header: 'Sensor Name',
			accessorFn: (row) => row.sensorName,
			filterVariant: 'multi-select',
			filterSelectOptions: filterSelectOptions.sensorName,
		},
		{
			id: 'faculty',
			header: 'Faculty',
			accessorFn: (row) => row.faculty,
			filterVariant: 'multi-select',
			filterSelectOptions: filterSelectOptions.faculty,
		},
		{
			id: 'room',
			header: 'Room',
			accessorFn: (row) => row.room,
			filterVariant: 'multi-select',
			filterSelectOptions: filterSelectOptions.room,
		},
		{
			id: 'datastreamId',
			header: 'Datastream ID',
			accessorFn: (row) => row.datastreamId,
			filterVariant: 'multi-select',
			filterSelectOptions: filterSelectOptions.datastreamId,
		},
		{
			id: 'datastreamName',
			header: 'Datastream Name',
			accessorFn: (row) => row.datastreamName,
			filterVariant: 'multi-select',
			filterSelectOptions: filterSelectOptions.datastreamName,
		},
		{
			id: 'unitOfMeasurement',
			header: 'Unit of Measurement',
			accessorFn: (row) => row.unitOfMeasurement,
			filterVariant: 'multi-select',
			filterSelectOptions: filterSelectOptions.unitOfMeasurement,
		},
	], [filterSelectOptions]);

	const data = tableContent.map((row: any, index: number) => ({
		id: index,
		sensorId: row.sensorId,
		sensorName: row.sensorName,
		faculty: row.faculty,
		room: row.room,
		datastreamId: row.datastreamId,
		datastreamName: row.datastreamName,
		unitOfMeasurement: row.unitOfMeasurement,
		timeRange: '', // This should be replaced with the actual data
	}));

	const table = useMaterialReactTable({
		columns,
		data,
		enablePagination: false, // Enabling will break table for some unknown reason
		initialState: { showColumnFilters: true },
		renderTopToolbarCustomActions: () => (
			<Button
				onClick={() => handleExportRows(data)}
				startIcon={<FileDownloadIcon />}
			>
				Export All Data
			</Button>
		),
	});

	return (
		<div style={{ height: 400, width: '100%' }}>
			<MaterialReactTable table={table} />
		</div>
	);
}

interface UnitOfMeasurement {
	name: string;
	symbol: string;
	definition: string;
}

interface Datastream {
	'@iot.selfLink': string;
	'@iot.id': number;
	name: string;
	description: string;
	observationType: string;
	unitOfMeasurement: UnitOfMeasurement;
	observedArea: {
		type: string;
		coordinates: [number, number];
	};
	phenomenonTime: string;
	resultTime: string;
}

interface Sensor {
	'@iot.selfLink': string;
	'@iot.id': number;
	name: string;
	description: string;
	encodingType: string;
	metadata: string;
	Datastreams: Datastream[];
	'Datastreams@iot.navigationLink': string;
	Room: string;
	Faculty: string;
}

/*
const fetchData = useCallback(async () => {
		let allDatastreamsData: any = [];
		for (const sensor of selectedSensors) {
			try {
				const datastreamPromises = sensor.Datastreams.map(async (datastream: any) => {
					const observations = await fetchDatastreamContents(datastream['@iot.selfLink']);
					return {
						sensorId: sensor['@iot.id'],
						sensorName: sensor.name,
						datastreamId: datastream['@iot.id'],
						datastreamName: datastream.name,
						unitOfMeasurement: datastream.unitOfMeasurement,
						datastreamDescription: datastream.description,
						observations
					};
				});

				const datastreamsData = await Promise.all(datastreamPromises);
				allDatastreamsData = [...allDatastreamsData, ...datastreamsData];
				setTableContent(allDatastreamsData);
			} catch (error) {
				console.error(`Failed to fetch data for sensor: ${sensor['@iot.id']}`, error);
			}
		}
	}, [selectedSensors]);
*/

async function fetchDatastreamContents(datastream: string): Promise<any> {
	const url = `${datastream}?
        $select=Observations&
        $expand=Observations($top=5;$orderby=resultTime%20desc)
    `;
	console.log("fetching datastream contents: " + datastream)
	const response = await fetchUrl(url);
	return response.Observations;
}

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

const handleExportRows = (rows: any[]) => {
	const rowData = rows.map((row) => row);
	const csv = generateCsv(csvConfig)(rowData);
	download(csvConfig)(csv);
};

const csvConfig = mkConfig({
	fieldSeparator: ',',
	decimalSeparator: '.',
	useKeysAsHeaders: true,
});


export default DatasetViewer;
