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
			<Post posts={posts} />
		</>
	);
};
export default CategoryPage;
