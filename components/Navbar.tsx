import React from "react";
import Link from "next/link";
import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import LockPersonIcon from "@mui/icons-material/LockPerson";
const NavLinks = [
	{ href: "/", name: "home" },
	{ href: "/dashboard", name: "dashboard" },
];
const Navbar = () => {
	const theme: any = useTheme();
	// console.log(theme);

	return (
		<div>
			<div>
				<AppBar
					position="sticky"
					sx={{ backgroundColor: "white", boxShadow: "none" }}
				>
					<Toolbar>
						<Grid container>
							<Grid item>
								<Button
									LinkComponent={Link}
									href={"/"}
									sx={{
										color: theme.palette.text1.main,
										textTransform: "lowercase",
										fontSize: 18,
									}}
								>
									codeblock.
								</Button>
							</Grid>
						</Grid>
						<Grid container>
							{/* <Grid item>
								<Button
									style={{ color: theme.palette.text1.main }}
									LinkComponent={Link}
									href={"/"}
								>
									home
								</Button>
							</Grid>
							<Grid item>
								<Link href={"/dashboard"}>dashboard</Link>
							</Grid> */}
							<Grid item>
								<Button
									style={{
										color: theme.palette.text1.main,
										textTransform: "lowercase",
										fontSize: 18,
										fontWeight: theme.typography.fontWeightRegular,
									}}
									LinkComponent={Link}
									href={"/"}
								>
									home
								</Button>
								<Button
									style={{
										color: theme.palette.text1.main,
										textTransform: "lowercase",
										fontSize: 18,
										fontWeight: theme.typography.fontWeightRegular,
									}}
									LinkComponent={Link}
									href={"/dashboard"}
								>
									dashboard
								</Button>
								<Button
									style={{
										color: theme.palette.text1.main,
										textTransform: "lowercase",
										fontSize: 18,
										fontWeight: theme.typography.fontWeightRegular,
									}}
									LinkComponent={Link}
									href={"/search"}
									endIcon={<SearchIcon />}
								>
									search
								</Button>
							</Grid>
							))
						</Grid>
						<Grid>
							<Button
								style={{
									color: theme.palette.text1.main,
									textTransform: "lowercase",
									fontSize: 18,
									fontWeight: theme.typography.fontWeightRegular,
								}}
								LinkComponent={Link}
								href={"/auth/login"}
								startIcon={<LockPersonIcon />}
							>
								authenticate
							</Button>
						</Grid>
					</Toolbar>
				</AppBar>
			</div>
		</div>
	);
};

export default Navbar;
