import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
const Post: NextPage<{ post: any }> = ({ post }) => {
	return (
		<>
			<div>{post.title}</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	res,
	query,
}) => {
	const response = await axios.get(`posts/${query.id}`);
	console.log(response.data);
	return {
		props: { post: response.data },
	};
};
export default Post;
