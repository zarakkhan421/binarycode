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
import Navbar from "../components/Navbar";
interface User {
	email: string;
	role: string;
	access: string;
	refresh: string;
}
export const userContext = createContext<{
	user: User;
	setUser: (user: User) => void;
}>({
	user: { email: "", role: "", access: "", refresh: "" },
	setUser: () => {},
});

export default function App({ Component, pageProps }: AppProps) {
	const [user, setUser] = useState({
		email: "",
		role: "",
		access: "",
		refresh: "",
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
			console.log(response.data);
			setUser({
				email: response.data.email,
				role: response.data.role,
				access: response.data.access,
				refresh: response.data.refresh,
			});
		};
		getToken();
	}, []);
	return (
		<userContext.Provider value={{ user, setUser }}>
			<Navbar />
			<Component {...pageProps} />
		</userContext.Provider>
	);
}
