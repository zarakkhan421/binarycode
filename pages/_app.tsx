import "../styles/globals.css";
import "../styles/Home.css";
import type { AppProps } from "next/app";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import Navbar from "../components/Navbar";
import { Container } from "@mui/system";
import { useRouter } from "next/router";

interface User {
	email: string;
	role: string;
	access: string;
	refresh: string;
	user_id: string;
	isLoggedin: boolean;
}
export const userContext = createContext<{
	user: User;
	setUser: (user: User) => void;
}>({
	user: {
		email: "",
		role: "",
		access: "",
		refresh: "",
		user_id: "",
		isLoggedin: false,
	},
	setUser: () => {},
});
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
	const router = useRouter();

	const [user, setUser] = useState({
		email: "",
		role: "",
		access: "",
		refresh: "",
		user_id: "",
		isLoggedin: false,
	});

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
		console.log("ref res", response.data);
		setUser({
			email: response.data.email,
			role: response.data.role,
			access: response.data.access,
			refresh: response.data.refresh,
			user_id: response.data.user_id,
			isLoggedin: true,
		});
	};

	useEffect(() => {
		getToken();
	}, []);
	return (
		<CacheProvider value={emotionCache}>
			<userContext.Provider value={{ user, setUser }}>
				<Head>
					<meta name="viewport" content="initial-scale=1, width=device-width" />
				</Head>
				<ThemeProvider theme={theme}>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					<Navbar />
					<Container fixed>
						<Component {...pageProps} />
					</Container>
				</ThemeProvider>
			</userContext.Provider>
		</CacheProvider>
	);
}
