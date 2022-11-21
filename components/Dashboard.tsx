import { GetServerSideProps, NextPage } from "next";
import React, { useContext, useEffect, useState, FC } from "react";
import axios, { AxiosResponse } from "axios";
import { userContext } from "../pages/_app";
import Link from "next/link";
import jwtDecode, { JwtPayload } from "jwt-decode";
import baseAxios from "../utils/axiosServer";
import axiosServer from "../utils/axiosServer";
import useAxiosClient from "../utils/axiosClient";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";

import {
	Button,
	Typography,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Tabs,
	useTheme,
} from "@mui/material";
import { Box } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useRouter } from "next/router";
interface Post {
	uid: string;
	title: string;
	excerpt: string;
	user_id: {
		email: string;
		role: string;
	};
}
interface Category {
	uid: string;
	name: string;
}
type Props = {
	children: React.ReactNode;
};

const Home = (props: React.PropsWithChildren) => {
	// const { user } = useContext(userContext);
	// const [posts, setPosts] = useState(postsData.posts);
	// const axiosClient = useAxiosClient();
	// // console.log("sdcsfvtet", postsData);
	const theme = useTheme();
	const router = useRouter();
	const { user } = useContext(userContext);

	// const deletePostHandler = async (e: any) => {
	// 	e.preventDefault();
	// 	console.log(e.target.post_uid.value);
	// 	const response = await axiosClient.delete(
	// 		`http://127.0.0.1:8000/posts/${e.target.post_uid.value}`
	// 	);
	// 	try {
	// 		setPosts(
	// 			posts.filter((post: any) => post.uid !== e.target.post_uid.value)
	// 		);
	// 		// console.log(response);
	// 	} catch (error) {
	// 		console.log("failed delete");

	// 		console.log(error);
	// 	}
	// };

	return (
		<div>
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ width: "200px", borderBottom: "0" }}>
							<Box>
								<Box>
									<Box>
										<Typography>{user.email}</Typography>
										<Typography>{user.role}</Typography>
									</Box>
									<Button
										sx={{
											color:
												router.pathname === "/dashboard/posts"
													? "white"
													: theme.palette.text1.main,
											backgroundColor:
												router.pathname === "/dashboard/posts"
													? "black"
													: "white",
											textTransform: "none",
											fontSize: 20,
											width: "100%",
											marginBottom: "2.5px",
											fontWeight: 500,
											borderRadius: 1,
											border: "1px #272727 solid",
											"&:hover": {
												backgroundColor: "#272727",
												color: "#e9e9e9",
											},
										}}
										href="/dashboard/posts/"
										LinkComponent={Link}
									>
										posts
									</Button>
								</Box>
								<Box>
									<Button
										sx={{
											color:
												router.pathname === "/dashboard/categories"
													? "white"
													: theme.palette.text1.main,
											backgroundColor:
												router.pathname === "/dashboard/categories"
													? "black"
													: "white",
											textTransform: "none",
											fontSize: 20,
											width: "100%",
											marginBottom: "2.5px",
											fontWeight: 500,
											borderRadius: 1,
											border: "1px #272727 solid",
											"&:hover": {
												backgroundColor: "#272727",
												color: "#e9e9e9",
											},
										}}
										href="/dashboard/categories/"
										LinkComponent={Link}
									>
										categories
									</Button>
								</Box>
								<Box>
									<Button
										sx={{
											color:
												router.pathname === "/dashboard/profile/edit"
													? "white"
													: theme.palette.text1.main,
											backgroundColor:
												router.pathname === "/dashboard/profile/edit"
													? "black"
													: "white",
											textTransform: "none",
											fontSize: 20,
											width: "100%",
											marginBottom: "2.5px",
											fontWeight: 500,
											borderRadius: 1,
											border: "1px #272727 solid",
											"&:hover": {
												backgroundColor: "#272727",
												color: "#e9e9e9",
											},
										}}
										href="/dashboard/profile/edit/"
										LinkComponent={Link}
									>
										edit profile
									</Button>
								</Box>
								<Box>
									<Button
										sx={{
											color:
												router.pathname === "/dashboard/comments"
													? "white"
													: theme.palette.text1.main,
											backgroundColor:
												router.pathname === "/dashboard/comments"
													? "black"
													: "white",
											textTransform: "none",
											fontSize: 20,
											width: "100%",
											marginBottom: "2.5px",
											fontWeight: 500,
											borderRadius: 1,
											border: "1px #272727 solid",
											"&:hover": {
												backgroundColor: "#272727",
												color: "#e9e9e9",
											},
										}}
										href="/dashboard/comments"
										LinkComponent={Link}
									>
										comments
									</Button>
								</Box>
							</Box>
						</TableCell>
						<TableCell>{props.children}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			{/* {posts !== undefined &&
				posts.map((post: any) => {
					return (
						<div key={post.uid}>
							div
							<span>{post.title}</span>
							<span>{post.excerpt}</span>
							<span>{post.user_id.role}</span>
							<Link href={`/posts/${post.uid}`}>go to </Link>
							<span>
								<form onSubmit={deletePostHandler}>
									<input type="hidden" name="post_uid" value={post.uid} />
									<input type="submit" value="delete" />
								</form>
							</span>
						</div>
					);
				})} */}
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const axiosApi = axiosServer(req);
	const response = await axiosApi.get("http://127.0.0.1:8000/posts/mine/");

	return {
		props: {
			posts: response.data,
			// categories,
		},
	};
};
export default Home;
