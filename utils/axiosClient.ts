import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { userContext } from "../pages/_app";
import { useContext } from "react";
const useAxiosClient = () => {
	let { user } = useContext(userContext);
	// an expired token is provided so that there is somethong to decode in case of refresh
	let access =
		user.access ||
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY4MzI2NDY1LCJpYXQiOjE2NjgyMzM5MjAsImp0aSI6IjA4YmUwZTk4Y2MxZTQxOTA4NjcxZDU3YTgyNmM1MWRiIiwidXNlcl9pZCI6ImNiNGZiMjRkLTAwZWYtNDg3Yy04YjM5LTQ4OWJkMjVjY2M5ZSJ9.7yF2f1reb4pPubR5Jwy8bGLkLhUc_TE7IKZJattojE4";
	let refresh = user.refresh;
	const axiosClient = axios.create({
		baseURL: "http://127.0.0.1:8000/",
		withCredentials: true,
		headers: {
			Authorization: `Bearer ${access}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	axiosClient.interceptors.request.use(async (req: any) => {
		console.log("dssd", access.length);

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
	return axiosClient;
};

export default useAxiosClient;
