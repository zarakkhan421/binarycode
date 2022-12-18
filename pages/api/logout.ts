import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import axios from "axios";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	console.log(req.cookies);
	let user = await axios.post(
		"http://127.0.0.1:8000/api/auth/logout/",
		{},
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
		serialize("refresh_token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
			sameSite: "strict",
			maxAge: -1,
			path: "/",
		}),
		serialize("access_token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
			sameSite: "strict",
			maxAge: -1,
			path: "/",
		}),
	]);

	// res.redirect("/");
	// res.status(200).json({ success: true });
}
