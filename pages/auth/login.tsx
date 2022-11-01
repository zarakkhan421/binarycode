import { NextPage } from "next";
import { useState, SyntheticEvent } from "react";
import Router from "next/router";
import axios from "axios";
import { useContext } from "react";
import { userContext } from "../_app";
const SignUp: NextPage = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { setUser } = useContext(userContext);
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		console.log("login");

		console.log(e);
		try {
			let user = await axios.post(
				"http://localhost:3000/api/login/",
				{
					email,
					password,
				},
				{
					withCredentials: true,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);
			console.log(user);
			setUser({
				email: user.data.user.email,
				role: user.data.user.role,
				access: user.data.user.access,
			});
			Router.push("/dashboard");
		} catch (error) {
			// console.log(error);
		}
	};

	return (
		<div>
			login
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="email"
					id=""
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="text"
					name="password"
					id=""
					onChange={(e) => setPassword(e.target.value)}
				/>
				<input type="submit" value="login" />
			</form>
		</div>
	);
};

// const getServerSideProps = () => {

// 	return {
// 		props: {

// 		}
// 	}
// };
export default SignUp;
