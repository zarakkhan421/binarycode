import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
const axiosServer = (req: any) => {
	let access = req.cookies.access_token;
	let refresh = req.cookies.refresh_token;
	const axiosApi = axios.create({
		baseURL: "http://127.0.0.1:8000/",
		withCredentials: true,
		headers: {
			Authorization: `Bearer ${access}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	axiosApi.interceptors.request.use(async (req: any) => {
		console.log(access);
		const decodedAccessToken: any = jwtDecode<JwtPayload>(access);
		const expireTime = decodedAccessToken.exp * 1000;
		const date = Date.now();
		if (expireTime < date) {
			console.log("in refresh t");
			const response = await axios.post(
				`http://localhost:3000/api/refresh/`,
				{
					refresh,
				},
				{
					withCredentials: true,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);
			req.headers.Authorization = `Bearer ${response.data.access}`;
			return req;
		}
		return req;
	});
	return axiosApi;
};

export default axiosServer;
