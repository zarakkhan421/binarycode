import { Grid } from "@mui/material";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Post from "../../components/Post";
const CategoryPage = () => {
	const { query } = useRouter();
	console.log("df", query);
	const [posts, setPosts] = useState([]);
	const getPosts = async () => {
		if (query.id) {
			const response = await axios.get(
				`http://127.0.0.1:8000/posts/category/${query.id}`
			);
			console.log("tfv", response);
			setPosts(response.data);
		}
	};
	useEffect(() => {
		getPosts();
	}, [query]);
	return (
		<>
			<Grid container spacing={2}>
				{posts.map((post: any) => (
					<Grid item xs={6} md={3} key={post.uid}>
						<Post post={post} />
					</Grid>
				))}
			</Grid>
			{/* <Post posts={posts} /> */}
		</>
	);
};
export default CategoryPage;
