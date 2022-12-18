import React from "react";
import Link from "next/link";
import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../pages/_app";
import axios from "axios";
import { Box } from "@mui/system";
import { useRouter } from "next/router";

const Categories = ({ category, categoryChildren, i }: any) => {
	let children = null;
	const theme: any = useTheme();
	i++;
	children = categoryChildren.map((child: any) => {
		return (
			<Categories
				key={child.uid}
				category={child}
				categoryChildren={child.children}
				i={i}
			/>
		);
	});

	return (
		<>
			<ul
				style={{
					listStyle: "none",
					paddingInlineStart: 20,
					// backgroundColor: "red",
				}}
			>
				<li
					style={
						{
							// color: "black",
							// display: "block",
							// backgroundColor: "yellow",
						}
					}
					onClick={() => {
						let el: any = document.getElementById("nav-categories-menu");
						el.style.display = "none";
					}}
					id={`children-tree-${category.tree_id}-level-${category.level}`}
				>
					<Link
						style={{
							textDecoration: "none",
							fontWeight: 500,
							color: theme.palette.text1.main,
						}}
						href={`http://localhost:3000/category/${category.uid}`}
					>
						{category.name}
					</Link>
				</li>
				{children ? children : null}
			</ul>
		</>
	);
};
const Navbar = () => {
	const theme: any = useTheme();
	// console.log(theme);
	const router = useRouter();
	const { user, setUser } = useContext(userContext);
	const [categories, setCategories] = useState([]);
	const getCategories = async () => {
		const response = await axios.get(`http://127.0.0.1:8000/categories/`);
		console.log(response);
		setCategories(response.data);
	};
	useEffect(() => {
		getCategories();
	}, []);

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
										fontSize: 22,
									}}
								>
									codeblock.
								</Button>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item sx={{ position: "relative" }}>
								<Button
									sx={{
										color: theme.palette.text1.main,
										textTransform: "lowercase",
										fontSize: 22,
										marginRight: 2,
										fontWeight: theme.typography.fontWeightRegular,
									}}
									onClick={() => {
										let el: any = document.getElementById(
											"nav-categories-menu"
										);
										if (el.style.display === "none") el.style.display = "block";
										else el.style.display = "none";
									}}
								>
									categories
								</Button>
								<Box
									sx={{
										display: "none",
										position: "relative",
										backgroundColor: "#e6e6e6",
										width: 200,
										borderRadius: 2,
									}}
									id="nav-categories-menu"
									className="nav-categories-menu"
								>
									{categories.map((category: any) => {
										let i = 0;
										return (
											<Categories
												key={category.uid}
												category={category}
												categoryChildren={category.children}
												i={i}
											/>
										);
									})}
								</Box>
							</Grid>
							<Grid item>
								{user.isLoggedin && (
									<Button
										style={{
											color: theme.palette.text1.main,
											textTransform: "lowercase",
											fontSize: 22,
											marginRight: 2,
											fontWeight: theme.typography.fontWeightRegular,
										}}
										LinkComponent={Link}
										href={"/dashboard"}
									>
										dashboard
									</Button>
								)}
								<Button
									style={{
										color: theme.palette.text1.main,
										textTransform: "lowercase",
										fontSize: 22,
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
							{!user.isLoggedin ? (
								<Button
									style={{
										color: theme.palette.text1.main,
										textTransform: "lowercase",
										fontSize: 22,
										fontWeight: theme.typography.fontWeightRegular,
									}}
									LinkComponent={Link}
									href={"/auth/login"}
									startIcon={<LockPersonIcon />}
								>
									authenticate
								</Button>
							) : (
								<Button
									style={{
										color: theme.palette.text1.main,
										textTransform: "lowercase",
										fontSize: 22,
										fontWeight: theme.typography.fontWeightRegular,
									}}
									LinkComponent={Link}
									// href={"/api/logout"}
									onClick={() => {
										console.log("logout");
										router.push("/api/logout");
										setUser({
											email: "",
											role: "",
											access: "",
											refresh: "",
											user_id: "",
											isLoggedin: false,
										});
									}}
									startIcon={<LockPersonIcon />}
								>
									logout
								</Button>
							)}
						</Grid>
					</Toolbar>
				</AppBar>
			</div>
		</div>
	);
};

export default Navbar;
