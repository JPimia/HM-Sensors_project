import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTable, Column, useFilters } from 'react-table';
import { SensorContext } from '../App';

interface Data {
	[key: string]: any;
}

function DatasetViewer() {
	const {
		selectedSensors
	} = useContext(SensorContext)!;

	// const [fullSensorData, setullSensorData] = useState<any[]>([]);
	const [tableContent, setTableContent] = useState<any[]>([]);

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

	useEffect(() => {
		setTableContent([]);
		fetchData();
	}, [fetchData]);

	function RenderTable() {
		const columns = React.useMemo<Column<Data>[]>(() => [
			{
				Header: 'Datastream ID',
				accessor: 'datastreamId',
				Filter: SelectColumnFilter,
				filter: 'equals',
			},
			{
				Header: 'Sensor Name',
				accessor: 'sensorName',
				Filter: SelectColumnFilter,
				filter: 'equals',
			},
			{
				Header: 'Datastream Name',
				accessor: 'datastreamName',
				Filter: SelectColumnFilter,
				filter: 'equals',
			},
			{
				Header: 'Datastream Description',
				accessor: 'datastreamDescription',
				Filter: SelectColumnFilter,
				filter: 'equals',
			},
			{
				Header: 'Unit of Measurement',
				accessor: 'unitOfMeasurement.name',
				Filter: SelectColumnFilter,
				filter: 'equals',
			},
		], []);

		const {
			getTableProps,
			getTableBodyProps,
			headerGroups,
			rows,
			prepareRow,
		} = useTable<Data>({ columns, data: tableContent }, useFilters);

		return (
			<div>
				<table {...getTableProps()} style={{ width: '100%', margin: '0 auto' }}>
					<thead>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column: any) => (
									<th {...column.getHeaderProps()}>
										{column.render('Header')}
										{column.canFilter ? column.render('Filter') : null}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{rows.map(row => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()}>
									{row.cells.map(cell => (
										<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<div>
			<RenderTable />
		</div>
	);
}



// Define a default UI for filtering
interface FilterProps {
	column: {
		filterValue: string;
		setFilter: (filterValue: string | undefined) => void;
		preFilteredRows: any[];
		id: string;
	};
}

function SelectColumnFilter({
	column: { filterValue, setFilter, preFilteredRows, id },
}: FilterProps) {
	// Get dropdown menu contents
	const options = React.useMemo(() => {
		const options = new Set<any>();
		preFilteredRows.forEach(row => {
			options.add(row.values[id]);
		});
		return Array.from(options);
	}, [id, preFilteredRows]);

	// Render dropdown menu
	return (
		<select
			value={filterValue}
			onChange={e => {
				setFilter(e.target.value || undefined);
			}}
		>
			<option value="">All</option>
			{options.map((option, i) => (
				<option key={i} value={option}>
					{option}
				</option>
			))}
		</select>
	);
}

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
