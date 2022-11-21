import { NextPage } from "next";
import Dashboard from "../../../components/Dashboard";
import { Box, Grid, Button, MenuItem } from "@mui/material";
import { Field, Form, Formik, FieldArray } from "formik";
import { TextField, Select, Checkbox } from "formik-mui";
import * as Yup from "yup";
import useAxiosClient from "../../../utils/axiosClient";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../../_app";

const EditProfile: NextPage = () => {
	const axiosClient = useAxiosClient();
	const [userProfile, setUserProfile] = useState<any>({});
	const { user } = useContext(userContext);

	const getUserProfile = async () => {
		if (user.user_id) {
			const response = await axiosClient.get(
				`http://127.0.0.1:8000/api/auth/user/${user.user_id}/`
			);
			console.log(response);
			setUserProfile(response.data);
		}
	};
	useEffect(() => {
		getUserProfile();
	}, [user?.user_id]);

	return (
		<>
			<Dashboard>
				<Formik
					enableReinitialize
					initialValues={{
						firstName: userProfile.first_name || "",
						lastName: userProfile.last_name || "",
					}}
					validationSchema={Yup.object({
						firstname: Yup.string(),
						lastName: Yup.string(),
					})}
					onSubmit={async (values, { setSubmitting }) => {
						const response = await axiosClient.patch(
							`http://127.0.0.1:8000/api/auth/user/edit/`,
							{
								first_name: values.firstName,
								last_name: values.lastName,
							}
						);
						console.log(response);
						setSubmitting(false);
					}}
				>
					<Form>
						<Field
							component={TextField}
							label="First Name"
							name="firstName"
							type="text"
						/>
						<Field
							component={TextField}
							label="Last Name"
							name="lastName"
							type="text"
						/>
						<Button type="submit" variant="contained">
							save
						</Button>
					</Form>
				</Formik>
			</Dashboard>
		</>
	);
};

export default EditProfile;
