import { Typography, Box, Button } from "@mui/material";
import { NextPage } from "next";
import Link from "next/link";
import Dashboard from "../../../components/Dashboard";
import { useState, useEffect, useMemo, useId } from "react";
import useAxiosClient from "../../../utils/axiosClient";
import { useTable, TableOptions, Column, Cell } from "react-table";
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

	interface Cols {
		title: string;
		status: string;
		author: string;
	}

	const data = useMemo((): Cols[] => posts, [posts]);
	const columns = useMemo(
		() => [
			{ Header: "Title", accessor: "title" },
			{
				Header: "Status",
				accessor: "status",
			},
			{
				Header: "Author",
				accessor: "user_id",
				Cell: (cell: any) => {
					if (!cell.cell.value.name || cell.cell.value.name === " ") {
						return <>{cell.cell.value.email}</>;
					} else {
						return <>{cell.cell.value.name}</>;
					}
				},
			},
			{
				Header: "Role",
				accessor: "user_id.role",
			},
			{
				Header: "Comments",
				accessor: "comment_count",
			},
			{
				Header: "Views",
				accessor: "views",
			},
			{
				Header: "Action",
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
							href={`http://localhost:3000/posts/${cell.cell.value}`}
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
							href={`http://localhost:3000/dashboard/posts/edit/${cell.cell.value}`}
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
									`http://127.0.0.1:8000/posts/${cell.cell.value}`
								);
								console.log(response);
								setPosts(
									posts.filter((post: any) => post.uid !== cell.cell.value)
								);
							}}
						>
							Delete
						</Button>
					</div>
				),
			},
		],
		[posts]
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
