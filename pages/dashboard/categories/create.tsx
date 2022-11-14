import { NextPage } from "next";
import Dashboard from "../../../components/Dashboard";
import useAxiosClient from "../../../utils/axiosClient";
import { Box, Grid, Button, MenuItem } from "@mui/material";
import { Field, Form, Formik, FieldArray, validateYupSchema } from "formik";
import { TextField, Select, Checkbox } from "formik-mui";
import * as Yup from "yup";
import { useState, useEffect } from "react";
const Create: NextPage = () => {
	const axiosClient = useAxiosClient();
	const [categories, setCategories] = useState([]);
	const getCategories = async () => {
		const response = await axiosClient.get(
			`http://127.0.0.1:8000/categories/all/`
		);
		console.log(response);
		setCategories(response.data);
		console.log(categories.map((category: any) => category.uid));
	};
	useEffect(() => {
		getCategories();
	}, []);
	return (
		<Dashboard>
			<Formik
				enableReinitialize
				initialValues={{
					name: "",
					parent: "",
				}}
				validationSchema={Yup.object({
					name: Yup.string().required("name for category is required"),
					parent: Yup.string()
						.nullable()
						.optional()
						.oneOf(categories.map((category: any) => category.uid)),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					const response = await axiosClient.post(
						`http://127.0.0.1:8000/categories/`,
						{
							name: values.name,
							parent: !values.parent ? null : values.parent,
						}
					);
					console.log(values);
					console.log(response);

					setSubmitting(false);
				}}
			>
				<Form>
					<Field component={TextField} name="name" label="Name" type="text" />
					<Field
						component={Select}
						name="parent"
						label="Parent"
						as="select"
						sx={{ width: 200 }}
					>
						{categories.map((category: any) => (
							<MenuItem key={category.uid} value={category.uid}>
								{category.name}
							</MenuItem>
						))}
					</Field>
					<Button type="submit" variant="contained">
						save
					</Button>
				</Form>
			</Formik>
		</Dashboard>
	);
};

export default Create;
