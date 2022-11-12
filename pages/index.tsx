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

export interface PostType {
	uid: string;
	title: string;
	comment_count: number;
	excerpt: string;
}
interface Category {
	uid: string;
	name: string;
}

const Home: NextPage<{ posts: PostType[]; categories: Category[] }> = ({
	posts,
	categories,
}) => {
	const theme: any = useTheme();
	return (
		<div>
			{/* {posts.map((post: PostType) => {
				return (
					<div key={post.uid}>
						{post.title}
						<Link href={`/posts/${post.uid}`}>go to </Link>
					</div>
				);
			})}
			{categories.map((category: Category) => {
				return <div key={category.uid}>{category.name}</div>;
			})}
			<Button variant="contained">Contained</Button> */}
			<Grid container>
				<Grid item xs={12}>
					<Card sx={{ display: "flex", boxShadow: "none" }}>
						<CardMedia
							component={"img"}
							image={
								"data:image/jpeg;base64,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"
							}
							height={"200"}
							width={"40"}
							sx={{
								width: "500px",
								marginRight: 2,
							}}
						/>
						<CardContent>
							<Typography variant={"h3"} color={theme.palette.text1.main}>
								{posts[0].title}
							</Typography>
							<Grid container>
								<Grid item marginRight={2}>
									<Typography component={"span"}>22 views</Typography>
								</Grid>
								<Grid item>
									<Typography component={"span"}>
										{posts[0].comment_count} comments
									</Typography>
								</Grid>
								<Grid item>{<Typography>categories</Typography>}</Grid>
							</Grid>
							<Box>{posts[0].excerpt}</Box>
							<CardActions>
								<Link href={`http://localhost:3000/posts/${posts[0].uid}`}>
									read me.
								</Link>
							</CardActions>
						</CardContent>
					</Card>
				</Grid>

				<Typography variant="h2">latest posts.</Typography>

				<Grid container spacing={2}>
					{posts.map((post) => (
						<Grid item xs={6} md={3} key={post.uid}>
							<Card>
								<CardActionArea
									LinkComponent={Link}
									href={`http://localhost:3000/posts/${post.uid}`}
								>
									<CardMedia
										component={"img"}
										image={
											"data:image/jpeg;base64,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"
										}
										height={200}
										width={20}
									/>
									<CardContent>
										<Typography variant="h4">{post.title}</Typography>
										<Grid container>
											<Grid item>
												<Typography>2 views</Typography>
											</Grid>
											<Grid item>
												<Typography>{post.comment_count} comments</Typography>
											</Grid>
										</Grid>
										<Grid container>
											<Grid item>
												<Typography>{post.excerpt}</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					))}
				</Grid>
			</Grid>
		</div>
	);
};

export async function getServerSideProps(context: any) {
	let posts = await fetch("http://127.0.0.1:8000/posts/");
	// console.log("resp", posts);
	posts = await posts.json();
	// console.log("posts", posts);
	let categories = await fetch("http://127.0.0.1:8000/categories/");
	categories = await categories.json();
	return {
		props: {
			posts,
			categories,
		},
	};
}
export default Home;
