import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { serialize } from "cookie";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (!req.cookies.refresh_token && !req.body.refresh) {
			console.log("not logged in ");
			res.setHeader("Set-Cookie", [
				serialize("refresh_token", "", {
					httpOnly: true,
					secure: process.env.NODE_ENV !== "development",
					sameSite: "strict",
					maxAge: 0,
					path: "/",
				}),
				serialize("access_token", "", {
					httpOnly: true,
					secure: process.env.NODE_ENV !== "development",
					sameSite: "strict",
					maxAge: 0,
					path: "/",
				}),
			]);
			return res
				.status(200)
				.json({ success: false, message: "not logged in " });
		}
		const response = await axios.post(
			"http://127.0.0.1:8000/api/token/refresh/",
			{
				refresh: `${req.body.refresh || req.cookies.refresh_token}`,
			},
			{
				withCredentials: true,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}
		);
		res.setHeader(
			"Set-Cookie",
			serialize("access_token", response.data.access, {
				httpOnly: true,
				secure: process.env.NODE_ENV !== "development",
				sameSite: "strict",
				maxAge: 60 * 60 * 60 * 5,
				path: "/",
			})
		);
		console.log("re.ts", response.data);

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.log("err refresh", error.response.data);
		if (error.response.data.code === "token_not_valid") {
			res.setHeader("Set-Cookie", [
				serialize("refresh_token", "", {
					httpOnly: true,
					secure: process.env.NODE_ENV !== "development",
					sameSite: "strict",
					maxAge: 0,
					path: "/",
				}),
				serialize("access_token", "", {
					httpOnly: true,
					secure: process.env.NODE_ENV !== "development",
					sameSite: "strict",
					maxAge: 0,
					path: "/",
				}),
			]);
			res.status(200).json({ success: false, message: " not valid" });
		}
	}
}
