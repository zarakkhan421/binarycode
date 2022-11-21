import axios from "axios";
import { NextPage } from "next";
import { useEffect, useState, useMemo, useId } from "react";
import Dashboard from "../../../components/Dashboard";
import {
	Typography,
	Box,
	Button,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableFooter,
} from "@mui/material";
import Link from "next/link";
import { useTable } from "react-table";
import useAxiosClient from "../../../utils/axiosClient";
const Comments: NextPage = () => {
	const [comments, setComments] = useState([]);
	const getComments = async () => {
		const response = await axios.get(`http://127.0.0.1:8000/comments/`);
		console.log(response);
		setComments(response.data);
	};
	const axiosClient = useAxiosClient();
	const id = useId();
	useEffect(() => {
		getComments();
	}, []);
	interface Cols {
		content: string;
		// status: string;
		// author: string;
	}

	const data = useMemo((): Cols[] => comments, [comments]);
	const columns = useMemo(
		() => [
			{ Header: "Content", accessor: "content" },
			{ Header: "Post", accessor: "post_id.title" },
			{
				Header: "User",
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
							href={`http://localhost:3000/posts/${cell.row.original.post_id.uid}`}
						>
							Visit Post
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
									`http://127.0.0.1:8000/comments/${cell.cell.value}`
								);
								console.log(response);
								setComments(
									comments.filter(
										(comment: any) => comment.uid !== cell.cell.value
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
		[comments]
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
				<Typography variant="h4">comments</Typography>
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

export default Comments;
