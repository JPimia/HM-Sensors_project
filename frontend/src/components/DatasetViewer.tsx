import React, { useMemo, useContext, useState, useEffect, useRef, } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_Row, } from 'material-react-table';
import { SensorContext } from '../App';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { type FilterFn } from '@tanstack/react-table';
import moment from 'moment';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import { fetchObservations } from './fetches';
registerLocale("de", de);
setDefaultLocale("de");

function DatasetViewer() {
	const { selectedSensors } = useContext(SensorContext)!;
	const [tableContent, setTableContent] = useState<TableContent[]>([]);
	const [filterSelectOptions, setFilterSelectOptions] = useState<{ [key: string]: string[] }>({});
	const [loadingStatus, setLoadingStatus] = useState<{ initiated: boolean; loading: boolean; time: number; }>({ initiated: false, loading: false, time: 0 });
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [resultAmount, setResultAmount] = useState(1000);
	const [startDate, setStartDate] = useState<Date | null>(new Date());
	const [endDate, setEndDate] = useState<Date | null>(null);



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
					datastreamUrl: datastream['@iot.selfLink'],
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
	}, [selectedSensors]);



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
			id: 'observationCount',
			header: 'Observation Count',
			accessorFn: (row) => row.observationCount?.toString(),
		},
		{
			id: 'firstObservationResult',
			header: 'First Result',
			accessorFn: (row) => row.firstObservationResult,
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
		datastreamUrl: row.datastreamUrl,
		firstObservationResult: row.firstObservationResult,
		observationCount: row.observationCount,
	}));


	type TableContent = {
		sensorId: number;
		sensorName: string;
		faculty: string;
		room: string;
		datastreamId: number;
		datastreamName: string;
		unitOfMeasurement: string;
		datastreamUrl: string;
		observations?: { '@iot.id': number, resultTime: string | null, result: string | null }[];
		observationCount?: number;
		firstObservationResult?: string;
	};


	const handleFetchObservations = async (rows: MRT_Row<TableContent>[]) => {
		setLoadingStatus({ initiated: true, loading: true, time: 0 });
		intervalRef.current = setInterval(() => {
			setLoadingStatus((prevStatus) => ({ ...prevStatus, time: prevStatus.time + 1 }));
		}, 1000);

		const fetchPromises = rows.map(async (row: any) => {
			try {
				//id: number, resultAmount: number, startDate: Date, endDate ?: Date | null, nextUrl ?: string | null
				const result = await fetchObservations(row.original.datastreamId, resultAmount, startDate, endDate);
				const observations = result.value
				return {
					...row.original,
					observations: observations,
					observationCount: observations.length,
					firstObservationResult: observations[0].result !== null && observations[0].result !== undefined ? observations[0].result : null,
				};
			} catch (error) {
				console.error(`Error fetching observations for row: ${row.sensorName}`, error);
			}
		});

		const updatedRows = await Promise.all(fetchPromises);
		setTableContent(updatedRows);
		clearInterval(intervalRef.current!);
		setLoadingStatus({ initiated: true, loading: false, time: 0 });
	}


	const handleExportRows = (rows: MRT_Row<TableContent>[]) => {
		// Build data for sensors.csv
		const sensorData = rows.map((row, index) => {
			const originalRow = row.original;

			return {
				datastreamId: index + 1,  // Assigning new id
				sensorId: originalRow.sensorId,
				sensorName: originalRow.sensorName,
				faculty: originalRow.faculty,
				room: originalRow.room,
				datastreamName: originalRow.datastreamName,
				unitOfMeasurement: originalRow.unitOfMeasurement,
				observationCount: originalRow.observationCount !== null && originalRow.observationCount !== undefined ? originalRow.observationCount : [],
			};
		});
		// Build data for observations.csv
		const observationData = rows.flatMap((row, index) => {
			const originalRow = row.original;
			const observations = tableContent.find((content) => content.datastreamUrl === originalRow.datastreamUrl)?.observations;

			return observations ? formatObservations(observations, index + 1) : [];
		});




		let csvConfig = mkConfig({
			fieldSeparator: ',',
			decimalSeparator: '.',
			useKeysAsHeaders: true,
			filename: 'SensorData',
		});
		const csvSensors = generateCsv(csvConfig)(sensorData);
		download(csvConfig)(csvSensors);

		csvConfig = mkConfig({
			fieldSeparator: ',',
			decimalSeparator: '.',
			useKeysAsHeaders: true,
			filename: 'Observations',
		});
		const csvObservations = generateCsv(csvConfig)(observationData);
		download(csvConfig)(csvObservations);

		function formatObservations(observations: any, datastreamId: number) {
			return observations.map(({ resultTime, result }: { resultTime: string; result: string; }) => ({
				datastreamId: datastreamId,
				resultTime: resultTime ? moment(resultTime).format('DD-MM-YYYY HH:mm') : '',
				result: result !== null && result !== undefined ? parseFloat(result) : '' ? parseFloat(result) : ''
			})).filter(Boolean);
		}
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
			><Box sx={buttonBoxStyles}>
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
					</Button></Box>
				<Box>
					<Button
						onClick={() => handleFetchObservations(table.getRowModel().rows)}
					>
						Fetch Observations
					</Button>
					{loadingStatus.initiated && (
						<Box
							sx={loadingBoxStyles}
						>
							{loadingStatus.loading ? `Loading observations... ${Math.floor(loadingStatus.time / 60)}:${loadingStatus.time % 60}` : 'Finished loading observations'}
						</Box>)}
				</Box>
				<div style={{ display: 'flex' }}>
					<div style={{ marginRight: '20px', textAlign: 'center' }}>
						<p>End date</p>
						<DatePicker
							portalId="root-portal"
							selected={startDate}
							onChange={(date: Date | null) => setStartDate(date)}
							dateFormat="yyyy-MM-dd HH:mm:ss"
							timeInputLabel="Time:"
							showTimeInput
							placeholderText="2000-01-01 00:00:00"
							className="input"
						/>
					</div>
					<div style={{ marginRight: '20px', textAlign: 'center' }}>
						<p>Start date</p>
						<DatePicker
							portalId="root-portal"
							selected={endDate}
							onChange={(date: Date | null) => setEndDate(date)}
							dateFormat="yyyy-MM-dd HH:mm:ss"
							timeInputLabel="Time:"
							showTimeInput
							className="input"
						/>
					</div>
					<div style={{ textAlign: 'center' }}>
						<p>Max observations</p>
						<input
							type="number"
							value={resultAmount}
							onChange={(e) => setResultAmount(parseInt(e.target.value))}
							className="input"
						/>
					</div>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span>End date: Get observations until this date</span>
					<span>Start date: Get observations from this date</span>
					<span>Max observations: Maximum amount of observations to fetch</span>
				</div>
			</Box>
		),
	});

	const buttonBoxStyles = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',

	};

	const loadingBoxStyles = {
		display: 'flex',
		alignItems: 'flex-start',
		padding: '8px',
		backgroundColor: loadingStatus.loading ? 'orange' : 'green',
		color: 'white',
		borderRadius: '4px',
		marginLeft: '8px',
	};


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






export default DatasetViewer;
