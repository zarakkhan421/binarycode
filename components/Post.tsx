import {
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import image from "../public/placeholder-image.webp";

const Post = ({ post }: any) => {
	return (
		<Card>
			<CardActionArea
				LinkComponent={Link}
				href={`http://localhost:3000/posts/${post.uid}`}
			>
				<CardMedia>
					<Image
						alt="blog-image"
						src={image}
						width={300}
						style={{ objectFit: "cover" }}
					/>
				</CardMedia>
				<CardContent>
					<Typography variant="h4">{post.title}</Typography>
					<Grid container>
						<Grid item marginRight={1}>
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
	);
};

export default Post;
