import axios, {
	AxiosRequestConfig,
	CreateAxiosDefaults,
	AxiosInstance,
	AxiosStatic,
} from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";

export const tokenCheck = async (req: any) => {
	let access = req.cookies.access_token;
	const decoded: any = jwtDecode<JwtPayload>(access);

	if (Date.now() > decoded.exp * 1000) {
		console.log("refresh to  use", req.cookies.refresh_token);
		console.log("expire at server");

		const response = await axios.post(
			"http://localhost:3000/api/refresh/",
			{
				refresh: req.cookies.refresh_token,
			},
			{
				withCredentials: true,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}
		);
		access = response.data.access;
		console.log("dsdv", access);
	}
	return access;
};

// id is part of url
const axiosServer = async (req: any, url: any = "", data: any = "") => {
	const access = await tokenCheck(req);
	console.log("srga", req.method);
	const base = axios.create({
		baseURL: "http://127.0.0.1:8000/",
		headers: {
			withCredentials: true,
			Authorization: `Bearer ${access}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
	if (req.method === "GET") {
		const response = await base.get(url);
		return response.data;
	}
	if (req.method === "POST") {
		const response = await base.post(url, data);
		return response.data;
	}
	if (req.method === "PUT") {
		const response = await base.put(url, data);
		response.data;
	}
	if (req.method === "DELETE") {
		const response = await base.delete(url);
		response.data;
	}
};

export default axiosServer;
