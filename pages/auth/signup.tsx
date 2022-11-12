import { NextPage } from "next";
import { Typography, useTheme } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-mui";
import Button from "@mui/material/Button";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { userContext } from "../_app";
import { useContext } from "react";

const Signup: NextPage = () => {
	const theme = useTheme();
	const { setUser } = useContext(userContext);

	return (
		<div>
			<Formik
				initialValues={{ email: "", password: "", password2: "" }}
				validationSchema={Yup.object({
					email: Yup.string()
						.email("not valid email")
						.required("email is required"),
					password: Yup.string()
						.min(8, "minimum 8 charaters requied")
						.required("password is required"),
					password2: Yup.string()
						.oneOf([Yup.ref("password"), null], "passwords do not match")
						.required("confirm password is required"),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					console.log(values);
					const user = await axios.post(`http://localhost:3000/api/signup/`, {
						email: values.email,
						password: values.password,
						password2: values.password2,
					});
					console.log(user.data.user);
					setUser({
						email: user.data.user.email,
						role: user.data.user.role,
						access: user.data.user.token.access,
						refresh: user.data.user.token.refresh,
					});
					setSubmitting(false);
				}}
			>
				<Form style={{ marginTop: "12px" }}>
					<Typography variant="h4">Sign Up</Typography>
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						width={"100%"}
						height={"400px"}
					>
						<Grid item xs={12}>
							<Field
								label="Email"
								component={TextField}
								name="email"
								type="text"
								variant="outlined"
								sx={{ width: "300px" }}
							/>
						</Grid>
						<Grid item xs={6}>
							<Field
								label="Password"
								component={TextField}
								name="password"
								type="password"
								variant="outlined"
								sx={{ width: "300px" }}
							/>
						</Grid>
						<Grid item xs={6}>
							<Field
								label="Confirm Password"
								component={TextField}
								name="password2"
								type="password"
								variant="outlined"
								sx={{ width: "300px" }}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="contained"
								size="large"
								type="submit"
								sx={{ width: "125px" }}
								disableRipple
							>
								Sign Up
							</Button>
							<Typography sx={{ marginTop: "10px" }}>
								if you have an account{" "}
								<Link
									href={"/auth/login/"}
									style={{ color: theme.palette.primary.main }}
								>
									login here.
								</Link>
							</Typography>
						</Grid>
					</Grid>
				</Form>
			</Formik>
		</div>
	);
};

export default Signup;
