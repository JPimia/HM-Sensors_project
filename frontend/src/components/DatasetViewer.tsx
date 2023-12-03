import React, { useMemo, useContext, useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_Row, MRT_RowData } from 'material-react-table';
import { SensorContext } from '../App';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { type FilterFn } from '@tanstack/react-table';


function DatasetViewer() {
	const { selectedSensors } = useContext(SensorContext)!;
	const [tableContent, setTableContent] = useState<TableContent[]>([]);
	const [filterSelectOptions, setFilterSelectOptions] = useState<{ [key: string]: string[] }>({});

	// Create table content and filter select options
	useEffect(() => {
		let newTableContent: TableContent[] = [];
		let newFilterSelectOptions: { [key: string]: string[] } = {
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
					//datastreamDescription: datastream.description,
				});
				newFilterSelectOptions.sensorId.push(sensor['@iot.id'].toString());
				newFilterSelectOptions.sensorName.push(sensor.name);
				newFilterSelectOptions.faculty.push(sensor.Faculty || '');
				newFilterSelectOptions.room.push(sensor.Room || '');
				newFilterSelectOptions.datastreamId.push(datastream['@iot.id'].toString());
				newFilterSelectOptions.datastreamName.push(datastream.name);
				newFilterSelectOptions.unitOfMeasurement.push(datastream.unitOfMeasurement.name);
			});
		});

		setTableContent(newTableContent);

		for (let key in newFilterSelectOptions) {
			newFilterSelectOptions[key] = Array.from(new Set(newFilterSelectOptions[key]));
		}
		setFilterSelectOptions(newFilterSelectOptions);
		console.log(newFilterSelectOptions);
	}, [selectedSensors]);


	type TableContent = {
		sensorId: number;
		sensorName: string;
		faculty: string;
		room: string;
		datastreamId: number;
		datastreamName: string;
		unitOfMeasurement: string;
	};

	// Had to write custom filterFn
	const arrExactMatch: FilterFn<any> = (
		row,
		columnId: string,
		filterValue: string[]
	) => {
		if (filterValue.length === 0) return true;
		return filterValue.includes(row.getValue(columnId));
	}

	const columns = useMemo<MRT_ColumnDef<TableContent>[]>(() => [
		{
			id: 'sensorId',
			header: 'Sensor ID',
			accessorFn: (row) => row.sensorId.toString(), // filters use string values
			filterVariant: 'multi-select',
			filterSelectOptions: filterSelectOptions.sensorId,
		},
		{
			id: 'sensorName',
			header: 'Sensor Name',
			accessorFn: (row) => row.sensorName,
			filterVariant: 'multi-select',
			filterFn: arrExactMatch,
			filterSelectOptions: filterSelectOptions.sensorName,
		},
		{
			accessorKey: 'faculty',
			header: 'Faculty',
			filterVariant: 'multi-select',
			filterFn: arrExactMatch,
			filterSelectOptions: filterSelectOptions.faculty,
		},
		{
			accessorKey: 'room',
			header: 'Room',
			filterVariant: 'multi-select',
			filterFn: arrExactMatch,
			filterSelectOptions: filterSelectOptions.room,
		},
		{
			id: 'datastreamId',
			header: 'Datastream ID',
			accessorFn: (row) => row.datastreamId.toString(),
			filterVariant: 'multi-select',
			filterFn: arrExactMatch,
			filterSelectOptions: filterSelectOptions.datastreamId,
		},
		{
			accessorKey: 'datastreamName',
			header: 'Datastream Name',
			filterVariant: 'multi-select',
			filterFn: arrExactMatch,
			filterSelectOptions: filterSelectOptions.datastreamName,
		},
		{
			accessorKey: 'unitOfMeasurement',
			header: 'Unit of Measurement',
			filterVariant: 'multi-select',
			filterFn: arrExactMatch,
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

	const csvConfig = mkConfig({
		fieldSeparator: ',',
		decimalSeparator: '.',
		useKeysAsHeaders: true,
	});

	const handleExportRows = (rows: MRT_Row<TableContent>[]) => {
		const rowData = rows.map((row) => row.original);
		const csv = generateCsv(csvConfig)(rowData);
		download(csvConfig)(csv);
	}

	const table = useMaterialReactTable({
		columns,
		data,
		enablePagination: false, // Enabling will break table for some unknown reason
		enableRowSelection: true,
		columnFilterDisplayMode: 'popover',
		paginationDisplayMode: 'pages',
		positionToolbarAlertBanner: 'bottom',
		renderTopToolbarCustomActions: ({ table }) => (
			<Box
				sx={{
					display: 'flex',
					gap: '16px',
					padding: '8px',
					flexWrap: 'wrap',
				}}
			>
				<Button
					disabled={table.getRowModel().rows.length === 0}
					//export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
					onClick={() => handleExportRows(table.getRowModel().rows)}
					startIcon={<FileDownloadIcon />}
				>
					Export All Data
				</Button>
				{// Pagination is disabled, so this button is useless
				/*<Button
					disabled={table.getPrePaginationRowModel().rows.length === 0}
					//export all rows, including from the next page, (still respects filtering and sorting)
					onClick={() =>
						handleExportRows(table.getPrePaginationRowModel().rows)
					}
					startIcon={<FileDownloadIcon />}
				>
					Export All Rows
				</Button> */}
				<Button
					disabled={
						!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
					}
					//only export selected rows
					onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
					startIcon={<FileDownloadIcon />}
				>
					Export Selected Rows
				</Button>
			</Box>
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




export default DatasetViewer;
