import { NextPage } from "next";
import { useRouter } from "next/router";
import Dashboard from "../../../../components/Dashboard";
import { Box, Grid, Button, MenuItem } from "@mui/material";
import { Field, Form, Formik, FieldArray } from "formik";
import { TextField, Select, Checkbox } from "formik-mui";
import * as Yup from "yup";
import useAxiosClient from "../../../../utils/axiosClient";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../../_app";
import axios from "axios";

const Categories = ({ category, categoryChildren, post }: any) => {
	let children = null;
	children = categoryChildren.map((child: any) => {
		return (
			<Categories
				key={child.uid}
				category={child}
				categoryChildren={child.children}
				post={post}
			/>
		);
	});
	// console.log("post selected cats", post?.category_id);
	// console.log("category", category);
	// let selected = post?.category_id.map(
	// 	(selectedCategory: any) => selectedCategory.uid
	// );
	// console.log("selected", selected);

	// checkedCat = selected.includes(category.uid);
	// console.log("checked", checkedCat);

	return (
		<ul style={{ listStyle: "none", paddingInlineStart: 20 }}>
			<label>
				<Field
					component={Checkbox}
					type="checkbox"
					name="categories"
					sx={{
						padding: 0.5,
					}}
					value={`${category.uid || ""}`}
				/>
				{category.name}
				{children ? children : null}
			</label>
		</ul>
	);
};

const EditPost: NextPage = () => {
	const { user } = useContext(userContext);
	const [categories, setCategories] = useState<any>([]);

	const { query } = useRouter();
	const { id } = query;
	const axiosClient = useAxiosClient();
	const [post, setPost] = useState<any>({});
	console.log(id);
	const getPost = async () => {
		const response = await axiosClient.get(`http://127.0.0.1:8000/posts/${id}`);
		setPost(response.data);
		console.log("edit post", post);
	};
	const getCategories = async () => {
		const response = await axios.get(`http://127.0.0.1:8000/categories/`);
		console.log("res", response.data);
		setCategories(response.data);
	};
	useEffect(() => {
		if (query.id) {
			getPost();
			getCategories();
		}
	}, [query]);

	return (
		<>
			<Dashboard>
				{/* <Box> */}
				<Formik
					enableReinitialize
					initialValues={{
						title: post.title || "",
						content: post.content || "",
						status: post.status || "",
						excerpt: post.excerpt || "",
						categories: post.category_id?.map((cat: any) => cat.uid) || [],
					}}
					validationSchema={Yup.object({
						title: Yup.string().required("please enter a title"),
						content: Yup.string().required("enter some content"),
						status: Yup.string()
							.required("please choose a status")
							.oneOf(["published", "draft", "unpublished"]),
					})}
					onSubmit={async (values, { setSubmitting }) => {
						console.log("on submit", values);

						const post = await axiosClient.patch(
							`http://127.0.0.1:8000/posts/${id}/`,
							{
								title: values.title,
								content: values.content,
								status: values.status,
								excerpt: values.excerpt,
								user_id: user.user_id,
								category_id: values.categories,
							}
						);
						console.log(post.data);

						setSubmitting(false);
					}}
				>
					<Form>
						<Grid container>
							<Grid item xs={8}>
								<Grid container>
									<Grid item xs={12}>
										<Field
											component={TextField}
											label="Title"
											name="title"
											type="text"
										/>
									</Grid>
									<Grid item xs={12}>
										<Field
											component={TextField}
											label="Content"
											name="content"
											type="text"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={4}>
								<Grid container>
									<Grid item xs={12} sx={{ height: 200, overflowY: "scroll" }}>
										{categories.map((category: any) => (
											<Categories
												key={category.uid}
												category={category}
												categoryChildren={category.children}
												post={post}
											/>
										))}
									</Grid>
									<Grid item xs={12}>
										<Field
											component={Select}
											name="status"
											label="Choose Status"
											as={"select"}
											sx={{ width: 200 }}
										>
											<MenuItem value="published">Published</MenuItem>
											<MenuItem value="draft">Draft</MenuItem>
											<MenuItem value="unpublished">UnPublish</MenuItem>
										</Field>
									</Grid>
									<Grid item xs={12}>
										<Field
											component={TextField}
											label="Excerpt"
											name="excerpt"
											type="text"
										/>
									</Grid>
									<Grid item xs={12}>
										<Button type="submit" variant="contained">
											save
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Form>
				</Formik>
				{/* </Box> */}
			</Dashboard>
		</>
	);
};

export default EditPost;
