import { GetServerSideProps, NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { userContext } from "../_app";
import Link from "next/link";
import jwtDecode, { JwtPayload } from "jwt-decode";
import baseAxios from "../../utils/axiosServer";
import axiosServer from "../../utils/axiosServer";
import useAxiosClient from "../../utils/axiosClient";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import {
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@mui/material";
import Dashboard from "../../components/Dashboard";
import { Box } from "@mui/system";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
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

const Home: NextPage<{ posts: Post[] }> = (postsData) => {
	const { user } = useContext(userContext);
	const [posts, setPosts] = useState(postsData.posts);
	const axiosClient = useAxiosClient();
	// console.log("sdcsfvtet", postsData);

	const deletePostHandler = async (e: any) => {
		e.preventDefault();
		console.log(e.target.post_uid.value);
		const response = await axiosClient.delete(
			`http://127.0.0.1:8000/posts/${e.target.post_uid.value}`
		);
		try {
			setPosts(
				posts.filter((post: any) => post.uid !== e.target.post_uid.value)
			);
			// console.log(response);
		} catch (error) {
			console.log("failed delete");

			console.log(error);
		}
	};

	return (
		<div>
			{/* <Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ width: "200px", borderBottom: "0" }}>
							menu
						</TableCell>
						<TableCell>{}</TableCell>
					</TableRow>
				</TableBody>
			</Table> */}

			<Dashboard>dashboard</Dashboard>
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
