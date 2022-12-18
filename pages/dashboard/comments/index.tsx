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
	TablePagination,
	useTheme,
	IconButton,
} from "@mui/material";
import {
	KeyboardArrowRight,
	KeyboardArrowLeft,
	LastPage,
	FirstPage,
} from "@mui/icons-material";
import Link from "next/link";
import { useTable } from "react-table";
import useAxiosClient from "../../../utils/axiosClient";

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (
		event: React.MouseEvent<HTMLButtonElement>,
		newPage: number
	) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
			</IconButton>
		</Box>
	);
}

const Comments: NextPage = () => {
	const [comments, setComments] = useState([]);
	const [page, setPage] = useState(0);
	const [postsCount, setPostsCount] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const getComments = async () => {
		const response = await axios.get(
			`http://127.0.0.1:8000/comments/all?limit=${rowsPerPage}&offset=${
				page * rowsPerPage
			}`
		);
		console.log(response);
		setComments(response.data.results);
		setPostsCount(response.data.count);
	};
	const axiosClient = useAxiosClient();

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const id = useId();
	useEffect(() => {
		getComments();
	}, [page, rowsPerPage]);
	interface Cols {
		content: string;
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
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[
									5,
									10,
									25,
									{ label: "All", value: postsCount },
								]}
								colSpan={4}
								count={postsCount}
								rowsPerPage={rowsPerPage}
								page={page}
								SelectProps={{
									inputProps: {
										"aria-label": "rows per page",
									},
									native: true,
								}}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								ActionsComponent={TablePaginationActions}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
		</Dashboard>
	);
};

export default Comments;
