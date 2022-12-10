import { NextPage } from "next";
import Dashboard from "../../../components/Dashboard";
import {
	Typography,
	Button,
	Box,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableFooter,
} from "@mui/material";
import Link from "next/link";
import { useState, useId, useEffect, useMemo } from "react";
import useAxiosClient from "../../../utils/axiosClient";
import { useTable } from "react-table";

const Categories: NextPage = () => {
	const [categories, setCategories] = useState([]);
	const axiosClient = useAxiosClient();
	const getPosts = async () => {
		const response = await axiosClient.get(
			"http://127.0.0.1:8000/categories/all/"
		);
		console.log(response);
		setCategories(response.data);
	};
	const id = useId();
	useEffect(() => {
		getPosts();
	}, []);

	interface Cols {
		title: string;
		status: string;
		author: string;
	}

	const data = useMemo((): Cols[] => categories, [categories]);
	const columns = useMemo(
		() => [
			{ Header: "Name", accessor: "name" },
			{
				Header: "Parent",
				accessor: "parent.name",
			},
			{
				Header: "Actions",
				accessor: "uid",
				width: 200,
				Cell: (cell: any) => (
					<div>
						<Button
							LinkComponent={Link}
							size="small"
							sx={{
								textTransform: "none",
							}}
							variant="contained"
							href={`http://localhost:3000/category/${cell.cell.value}`}
						>
							Visit
						</Button>
						<Button
							LinkComponent={Link}
							size="small"
							sx={{
								textTransform: "none",
							}}
							variant="contained"
							href={`http://localhost:3000/dashboard/categories/edit/${cell.cell.value}`}
						>
							Edit
						</Button>
						<Button
							LinkComponent={Link}
							size="small"
							sx={{
								textTransform: "none",
								background: "red",
								"&:hover": {
									background: "red",
									opacity: 0.7,
								},
							}}
							variant="contained"
							onClick={async (e) => {
								console.log(e, cell.cell.value);
								const response = await axiosClient.delete(
									`http://127.0.0.1:8000/categories/${cell.cell.value}`
								);
								console.log(response);
								setCategories(
									categories.filter(
										(category: any) => category.uid !== cell.cell.value
									)
								);
							}}
						>
							Delete
						</Button>
					</div>
				),
			},
		],
		[categories]
	);
	const options: any = {
		data,
		columns,
	};
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable(options);
	return (
		<Dashboard>
			<Box>
				<Typography>categories</Typography>
				<Button
					variant="outlined"
					LinkComponent={Link}
					href="/dashboard/categories/create/"
				>
					add new
				</Button>
			</Box>
			<TableContainer>
				<Table {...getTableProps()}>
					<TableHead>
						{
							// Loop over the header rows
							headerGroups.map((headerGroup: any) => (
								// Apply the header row props

								<TableRow key={id} {...headerGroup.getHeaderGroupProps()}>
									{
										// Loop over the headers in each row
										headerGroup.headers.map((column: any) => (
											// Apply the header cell props
											<TableCell key={id} {...column.getHeaderProps()}>
												{
													// Render the header
													column.render("Header")
												}
											</TableCell>
										))
									}
								</TableRow>
							))
						}
					</TableHead>
					{/* Apply the table body props */}
					<TableBody {...getTableBodyProps()}>
						{
							// Loop over the table rows
							rows.map((row: any) => {
								// Prepare the row for display
								prepareRow(row);
								return (
									// Apply the row props
									<TableRow key={id} {...row.getRowProps()}>
										{
											// Loop over the rows cells
											row.cells.map((cell: any) => {
												// Apply the cell props
												return (
													<TableCell key={id} {...cell.getCellProps()}>
														{
															// Render the cell contents
															cell.render("Cell")
														}
													</TableCell>
												);
											})
										}
									</TableRow>
								);
							})
						}
					</TableBody>
				</Table>
			</TableContainer>
		</Dashboard>
	);
};

export default Categories;
