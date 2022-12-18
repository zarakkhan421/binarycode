import { NextPage } from "next";
import axios from "axios";
import Link from "next/link";
import Button from "@mui/material/Button";
import {
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Menu,
	MenuItem,
	MenuList,
	Typography,
	useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Post from "../components/Post";
import image from "../public/placeholder-image.webp";
import Image from "next/image";

interface Category {
	uid: string;
	name: string;
}
export interface PostType {
	uid: string;
	title: string;
	comment_count: number;
	excerpt: string;
	category_id: Category[];
}

const Home: NextPage<{ posts: PostType[] }> = ({ posts }) => {
	const theme: any = useTheme();
	return (
		<div>
			<Grid container>
				<Grid item xs={12}>
					<Card sx={{ display: "flex", boxShadow: "none" }}>
						<CardMedia>
							<Image
								alt="blog-image"
								src={image}
								width={500}
								style={{ objectFit: "cover" }}
							/>
						</CardMedia>
						<CardContent sx={{ paddingY: 0 }}>
							<Typography variant={"h3"} color={theme.palette.text1.main}>
								{posts[0].title}
							</Typography>
							<Grid container>
								<Grid item marginRight={2}>
									<Typography component={"span"}>22 views</Typography>
								</Grid>
								<Grid item marginRight={2}>
									<Typography component={"span"}>
										{posts[0].comment_count} comments
									</Typography>
								</Grid>
								<Grid item sx={{ position: "relative" }}>
									<Box sx={{ position: "absolute" }} className="categories">
										{posts[0].category_id.map((category) => (
											<Link
												href={`http://localhost:3000/category/${category.uid}`}
												key={category.uid}
												style={{
													textDecoration: "none",
													color: theme.palette.text1.main,
												}}
											>
												{category.name}
											</Link>
										))}
									</Box>
								</Grid>
							</Grid>
							<Box>{posts[0].excerpt}</Box>
							<CardActions sx={{ paddingLeft: 0 }}>
								<Button
									href={`http://localhost:3000/posts/${posts[0].uid}`}
									LinkComponent={Link}
									variant="contained"
									sx={{
										marginLeft: 0,
										textTransform: "none",
										fontSize: 22,
										fontWeight: 400,
										paddingX: 8,
										boxShadow: "none",
										"&:hover": {
											boxShadow: "none",
											backgroundColor: theme.palette.primary.main,
										},
									}}
								>
									read me.
								</Button>
							</CardActions>
						</CardContent>
					</Card>
				</Grid>

				<Typography variant="h2">latest posts.</Typography>
				<Grid container spacing={2}>
					{posts.map((post: any) => (
						<Grid item xs={6} md={3} key={post.uid}>
							<Post post={post} />
						</Grid>
					))}
				</Grid>
				<Typography variant="h2">top posts.</Typography>
				<Grid container spacing={2}>
					{posts.map((post: any) => (
						<Grid item xs={6} md={3} key={post.uid}>
							<Post post={post} />
						</Grid>
					))}
				</Grid>
			</Grid>
		</div>
	);
};

export async function getServerSideProps(context: any) {
	let posts: any = await fetch("http://127.0.0.1:8000/posts/");
	posts = await posts.json();
	console.log("resp", posts);
	return {
		props: {
			posts: posts.results,
		},
	};
}
export default Home;
