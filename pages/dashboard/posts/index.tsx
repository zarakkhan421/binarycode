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
	Pagination,
	IconButton,
	useTheme,
} from "@mui/material";
import {
	KeyboardArrowRight,
	KeyboardArrowLeft,
	LastPage,
	FirstPage,
} from "@mui/icons-material";
// import TablePagination from "@material-ui/TablePagination";
// import TablePaginationActions from "./TablePaginationActions";
// import TableSortLabel from "@material-ui/core/TableSortLabel";
import { NextPage } from "next";
import Link from "next/link";
import Dashboard from "../../../components/Dashboard";
import { useState, useEffect, useMemo, useId } from "react";
import useAxiosClient from "../../../utils/axiosClient";
import { useTable } from "react-table";

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

const Posts: NextPage = () => {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(0);
	const [postsCount, setPostsCount] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const axiosClient = useAxiosClient();
	const getPosts = async () => {
		const response = await axiosClient.get(
			`http://127.0.0.1:8000/posts/?limit=${rowsPerPage}&offset=${
				page * rowsPerPage
			}`
		);
		console.log(response);
		setPosts(response.data.results);
		setPostsCount(response.data.count);
	};

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
		getPosts();
	}, [page, rowsPerPage]);

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
								console.log("sfdegf", posts.length);
								// won't work on 0
								if (posts.length == 1) {
									setPage(page - 1);
								}
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
								rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
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

export default Posts;
