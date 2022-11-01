import { NextPage } from "next";
import axios from "axios";
import Link from "next/link";
export interface PostType {
	uid: string;
	title: string;
}
interface Category {
	uid: string;
	name: string;
}

const Home: NextPage<{ posts: PostType[]; categories: Category[] }> = ({
	posts,
	categories,
}) => {
	return (
		<div>
			{posts.map((post: PostType) => {
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
