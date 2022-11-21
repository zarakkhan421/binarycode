import { NextPage } from "next";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import Post from "../components/Post";
import { TextField } from "@mui/material";

const Search: NextPage = () => {
	const [posts, setPosts] = useState([]);
	const [query, setQuery] = useState("");
	const getSearch = async () => {
		if (query.length > 0) {
			const response = await axios.get(
				`http://127.0.0.1:8000/search/${query}/`
			);
			console.log(response);
			setPosts(response.data);
		}
	};
	useEffect(() => {
		getSearch();
	}, [query]);
	return (
		<>
			<form>
				<TextField
					type="text"
					name="query"
					label="Search"
					id=""
					size="small"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<span>
					{query.length > 0 ? (
						<>
							<span>query term: {query}</span>
						</>
					) : null}
				</span>
			</form>

			<Post posts={posts} />
		</>
	);
};
export default Search;
