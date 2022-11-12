import { Roboto } from "@next/font/google";
import { createTheme, PaletteOptions } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { ThemeOptions } from "@mui/material/styles/createTheme";
export const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["Helvetica", "Arial", "sans-serif"],
});
declare module "@mui/material/styles" {
	interface Palette {
		text1: Palette["primary"];
		text2: Palette["primary"];
	}
	interface PaletteOptions {
		text1: PaletteOptions["primary"];
		text2: PaletteOptions["primary"];
	}
}

// Create a theme instance.
const theme = createTheme({
	palette: {
		primary: {
			main: "#006CEB",
		},
		secondary: {
			main: "#F4F4F4",
		},
		error: {
			main: red.A400,
		},
		text1: { main: "#414141" },
		text2: { main: "#7c7c7c" },
	},
	typography: {
		fontFamily: ["Montserrat", roboto.style.fontFamily].join(","),
	},
});

export default theme;
