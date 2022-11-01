import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	console.log(req.body);
	console.log(req.cookies.access_token);

	console.log("sdfsvsgfsg");
	try {
		let post = await axios.delete(
			`http://127.0.0.1:8000/posts/${req.body.id}`,

			{
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${req.cookies.access_token}`,
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}
		);
		console.log("dfv");

		res.status(200).json({ success: true });
	} catch (error) {
		console.log("fdvtr");

		res.status(200).json({ success: false });
	}
}
