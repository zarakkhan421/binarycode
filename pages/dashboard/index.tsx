import { GetServerSideProps, NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { userContext } from "../_app";
import Link from "next/link";
import jwtDecode, { JwtPayload } from "jwt-decode";
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

const Home: NextPage<{ posts: any }> = (postsData) => {
	const { user } = useContext(userContext);
	const [posts, setPosts] = useState(postsData.posts);
	// console.log("sdcsfvtet", postsData);

	const deletePostHandler = async (e: any) => {
		e.preventDefault();
		console.log(e.target.post_uid.value);
		try {
			const response: AxiosResponse = await axios.delete(
				`http://127.0.0.1:8000/posts/${e.target.post_uid.value}`,
				{
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${user.access}`,
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);
			setPosts(
				posts.filter((post: any) => post.uid !== e.target.post_uid.value)
			);
			// console.log(response);
		} catch (error) {
			console.log("failed");

			// console.log(error);
		}
	};

	return (
		<div>
			{posts !== undefined &&
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
				})}
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	console.log(req.cookies.access_token);

	let access: any = req.cookies.access_token;
	console.log("old token", access);
	const decoded: any = jwtDecode<JwtPayload>(access);
	console.log(Date.now() > decoded.exp * 1000);
	console.log(Date.now());
	console.log(decoded.exp * 1000);
	console.log(decoded.exp * 1000 - Date.now());

	if (Date.now() > decoded.exp * 1000) {
		console.log("refresh to  use", req.cookies.refresh_token);
		console.log("expire at server");

		const response = await axios.post(
			"http://localhost:3000/api/refresh/",
			{
				refresh: req.cookies.refresh_token,
			},
			{
				withCredentials: true,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}
		);
		// console.log(response.data);
		access = response.data.access;
		console.log("refreshed", access);
	}
	const getPosts = async () => {
		try {
			console.log("accesin min", access);

			const response: AxiosResponse = await axios.get(
				"http://127.0.0.1:8000/posts/mine/",
				{
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${access}`,
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);

			// console.log(response);
			console.log("server");
			// console.log(response);

			return response.data;
		} catch (error: any) {
			// console.log(error);
			console.log("server error");
			// console.log(error);
			return error;
		}
	};
	const posts = await getPosts();
	// console.log(posts);
	console.log("a3f");

	return {
		props: {
			posts: posts,
			// categories,
		},
	};
};
export default Home;
