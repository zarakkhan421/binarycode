import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// console.log("cookies", req.cookies);

	// console.log("45ff in refresh.ts", req.body);

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

	// console.log("in refresh.ts", response.data);
	res.status(200).json(response.data);

	// console.log(response.data);
}
