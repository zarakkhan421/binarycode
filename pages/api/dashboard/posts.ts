import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
interface Post {
	uid: string;
	title: string;
	excerpt: string;
	user_id: {
		email: string;
		role: string;
	};
}
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Post[]>
) {
	console.log(req.cookies.access_token);

	let posts = await axios.get("http://127.0.0.1:8000/posts/mine/", {
		withCredentials: true,
		headers: {
			Authorization: `Bearer ${req.cookies.access_token}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
	// console.log(posts);

	res.status(200).json(posts.data);
}
