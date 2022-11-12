import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import axios from "axios";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let user = await axios.post(
		"http://127.0.0.1:8000/api/auth/register/",
		{
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2,
		},
		{
			withCredentials: true,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
	);
	// console.log(user.data);
	console.log("body");

	res.setHeader("Set-Cookie", [
		serialize("refresh_token", user.data.token.refresh, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
			sameSite: "strict",
			maxAge: 60 * 60 * 60 * 24,
			path: "/",
		}),
		serialize("access_token", user.data.token.access, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
			sameSite: "strict",
			maxAge: 60 * 60 * 60 * 5,
			path: "/",
		}),
	]);

	res.status(200).json({ user: user.data });
}
