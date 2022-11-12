import { Typography, Box, Button } from "@mui/material";
import { NextPage } from "next";
import Link from "next/link";
import Dashboard from "../../../components/Dashboard";
import { useState, useEffect, useMemo, useId } from "react";
import useAxiosClient from "../../../utils/axiosClient";
import { useTable, TableOptions, Column } from "react-table";
const Posts: NextPage = () => {
	const [posts, setPosts] = useState([]);
	const axiosClient = useAxiosClient();
	const getPosts = async () => {
		const response = await axiosClient.get("http://127.0.0.1:8000/posts/");
		console.log(response);
		setPosts(response.data);
	};
	const id = useId();
	useEffect(() => {
		getPosts();
	}, []);
	type Cols = { title: string; status: string };

	const data = useMemo((): Cols[] => posts, [posts]);
	const columns: Column<{ title: string; status: string }>[] = useMemo(
		() => [
			{ Header: "Title", accessor: "title" },
			{ Header: "Status", accessor: "status" },
		],
		[]
	);
	const options: TableOptions<{ title: string; status: string }> = {
		data,
		columns,
	};
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable(options);
	return (
		<Dashboard>
			<Box>
				<Typography>posts</Typography>
				<Button
					variant="outlined"
					LinkComponent={Link}
					href="/dashboard/posts/create/"
				>
					add new
				</Button>
			</Box>
			<Box>
				<table {...getTableProps()}>
					<thead>
						{
							// Loop over the header rows
							headerGroups.map((headerGroup: any) => (
								// Apply the header row props
								<tr key={id} {...headerGroup.getHeaderGroupProps()}>
									{
										// Loop over the headers in each row
										headerGroup.headers.map((column: any) => (
											// Apply the header cell props
											<th key={id} {...column.getHeaderProps()}>
												{
													// Render the header
													column.render("Header")
												}
											</th>
										))
									}
								</tr>
							))
						}
					</thead>
					{/* Apply the table body props */}
					<tbody {...getTableBodyProps()}>
						{
							// Loop over the table rows
							rows.map((row: any) => {
								// Prepare the row for display
								prepareRow(row);
								return (
									// Apply the row props
									<tr key={id} {...row.getRowProps()}>
										{
											// Loop over the rows cells
											row.cells.map((cell: any) => {
												// Apply the cell props
												return (
													<td key={id} {...cell.getCellProps()}>
														{
															// Render the cell contents
															cell.render("Cell")
														}
													</td>
												);
											})
										}
									</tr>
								);
							})
						}
					</tbody>
				</table>
			</Box>
		</Dashboard>
	);
};

export default Posts;
