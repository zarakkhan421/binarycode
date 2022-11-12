import { NextPage } from "next";
import Dashboard from "../../../components/Dashboard";
import { Box, Grid, Button, MenuItem } from "@mui/material";
import { Field, Form, Formik, FieldArray } from "formik";
import { TextField, Select, Checkbox } from "formik-mui";
import * as Yup from "yup";
import useAxiosClient from "../../../utils/axiosClient";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../_app";
import axios from "axios";

const Categories = ({ category, categoryChildren }: any) => {
	let children = null;
	children = categoryChildren.map((child: any) => {
		return (
			<Categories
				key={child.uid}
				category={child}
				categoryChildren={child.children}
			/>
		);
	});

	return (
		<ul style={{ listStyle: "none", paddingInlineStart: 20 }}>
			{/* <li>{category.name}</li>
			{children ? children : null} */}
			<label>
				<Field
					component={Checkbox}
					type="checkbox"
					name="categories"
					sx={{
						padding: 0.5,
					}}
					value={`${category.uid}`}
				/>
				{category.name}
				{children ? children : null}
			</label>
		</ul>
	);
};

const Create: NextPage = () => {
	const axiosClient = useAxiosClient();
	const { user } = useContext(userContext);
	const [categories, setCategories] = useState<any>([]);
	const getCategories = async () => {
		const response = await axios.get(`http://127.0.0.1:8000/categories/`);
		console.log("res", response.data);
		setCategories(response.data);
	};
	useEffect(() => {
		getCategories();
	}, []);
	return (
		<Dashboard>
			{/* <Box> */}
			<Formik
				initialValues={{
					title: "",
					content: "",
					status: "",
					excerpt: "",
					categories: [],
				}}
				validationSchema={Yup.object({
					title: Yup.string().required("please enter a title"),
					content: Yup.string().required("enter some content"),
					status: Yup.string()
						.required("please choose a status")
						.oneOf(["published", "draft", "unpublished"]),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					const post = await axiosClient.post(
						`http://127.0.0.1:8000/posts/create/`,
						{
							title: values.title,
							content: values.content,
							status: values.status,
							excerpt: values.excerpt,
							user_id: user.user_id,
							category_id: values.categories,
						}
					);
					console.log(values);
					console.log(post);

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
	);
};
export default Create;