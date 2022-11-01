import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
	createContext,
	useState,
	SetStateAction,
	useEffect,
	useContext,
} from "react";
import axios from "axios";
import Link from "next/link";
interface User {
	email: string;
	role: string;
	access: string;
}
export const userContext = createContext<{
	user: User;
	setUser: (user: User) => void;
}>({ user: { email: "", role: "", access: "" }, setUser: () => {} });

export default function App({ Component, pageProps }: AppProps) {
	const [user, setUser] = useState({
		email: "",
		role: "",
		access: "",
	});

	useEffect(() => {
		const getToken = async () => {
			console.log("loaded");

			const response = await axios.post(
				"http://localhost:3000/api/refresh/",
				{},
				{
					withCredentials: true,
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);
			console.log("sfvrb5");
			setUser({
				email: response.data.email,
				role: response.data.role,
				access: response.data.access,
			});
			console.log(response.data);
		};
		getToken();
	}, []);
	return (
		<userContext.Provider value={{ user, setUser }}>
			<div>
				<Link href={"/"}>Home</Link>
				<Link href={"/dashboard"}>Dashboard</Link>
			</div>
			<Component {...pageProps} />
		</userContext.Provider>
	);
}
