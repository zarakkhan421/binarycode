import { NextPage } from "next";
import { useState, SyntheticEvent } from "react";
import axios from "axios";
import { useContext } from "react";
import { userContext } from "../_app";
import Link from "next/link";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-mui";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import useAxiosClient from "../../utils/axiosClient";
import { useRouter } from "next/router";
const Login: NextPage = () => {
	const { setUser } = useContext(userContext);
	const theme = useTheme();
	const router = useRouter();
	return (
		<div>
			<Formik
				initialValues={{ email: "", password: "" }}
				validationSchema={Yup.object({
					email: Yup.string()
						.email("invalid email")
						.required("email is required"),
					password: Yup.string().min(8, "minimum characters should be 8"),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					console.log(values);
					const user = await axios.post(
						`http://localhost:3000/api/login/`,
						{ email: values.email, password: values.password }
						// {
						// 	withCredentials: true,
						// 	headers: {
						// 		Accept: "application/json",
						// 		"Content-Type": "application/json",
						// 	},
						// }
					);

					setUser({
						email: user.data.user.email,
						role: user.data.user.role,
						access: user.data.user.token.access,
						refresh: user.data.user.token.refresh,
						user_id: user.data.user.user_id,
						isLoggedin: true,
					});
					console.log(user);
					router.push("/");
					setSubmitting(false);
				}}
			>
				<Form style={{ marginTop: "12px" }}>
					<Typography variant="h4">Login</Typography>
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						width={"800px"}
						height={"400px"}
					>
						<Grid item xs={6}>
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
								label={"Password"}
								component={TextField}
								variant="outlined"
								name="password"
								type="password"
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
								Login
							</Button>

							<Typography sx={{ marginTop: "10px" }}>
								if you do not have an account registered you can{" "}
								<Link
									href={"/auth/signup/"}
									style={{ color: theme.palette.primary.main }}
								>
									signup here.
								</Link>
							</Typography>
						</Grid>
					</Grid>
				</Form>
			</Formik>
		</div>
	);
};

const getServerSideProps = () => {
	return {
		props: {},
	};
};
export default Login;
