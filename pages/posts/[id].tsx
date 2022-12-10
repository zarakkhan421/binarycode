import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { useEffect, useContext, useState } from "react";
import { Box, Grid, Button, MenuItem } from "@mui/material";
import { Field, Form, Formik, FieldArray } from "formik";
import { TextField, Select, Checkbox } from "formik-mui";
import * as Yup from "yup";
import { userContext } from "../_app";
import useAxiosClient from "../../utils/axiosClient";
import Link from "next/link";

const Comments = ({
	comment,
	commentReplies,
	post,
	user,
	setCount,
	commentCount,
	setCommentCount,
}: any) => {
	const axiosClient = useAxiosClient();
	let replies = null;
	replies = commentReplies.map((comment: any) => {
		return (
			<Comments
				key={comment.uid}
				comment={comment}
				commentReplies={comment.replies}
				post={post}
				user={user}
				setCount={setCount}
				commentCount={commentCount}
				setCommentCount={setCommentCount}
			/>
		);
	});

	return (
		<ul
			style={{
				listStyle: "none",
				paddingInlineStart: comment.level === 0 ? 0 : 20,
			}}
		>
			{/* parent comment */}
			{comment.content + " " + comment.user_id.email}

			{/* buttons along parent comment */}
			<Button
				variant="contained"
				size="small"
				onClick={(e: any) => {
					const el: any = document.getElementById(`reply-${comment.uid}`);
					if (el.style.display === "none") el.style.display = "block";
					else el.style.display = "none";
				}}
			>
				Reply
			</Button>

			<Button
				variant="contained"
				size="small"
				onClick={(e: any) => {
					const el: any = document.getElementById(`edit-${comment.uid}`);
					if (el.style.display === "none") el.style.display = "block";
					else el.style.display = "none";
				}}
			>
				edit
			</Button>

			<Button
				variant="contained"
				size="small"
				style={{ backgroundColor: "red" }}
				onClick={async (e: any) => {
					const response = await axiosClient.delete(
						`http://127.0.0.1:8000/comments/${comment.uid}`
					);
					console.log(response);
					setCommentCount(commentCount - 1);
				}}
			>
				delete
			</Button>

			{/* reply form - appears when reply button is clicked */}
			<Formik
				initialValues={{
					content: "",
					user_id: "",
					post_id: "",
					parent: "",
				}}
				validationSchema={Yup.object({
					content: Yup.string().required("write a reply"),
				})}
				onSubmit={async (values, actions) => {
					console.log(values);
					const response = await axiosClient.post(
						`http://127.0.0.1:8000/comments/`,
						{
							content: values.content,
							user_id: values.user_id,
							post_id: values.post_id,
							parent: values.parent === "" ? null : values.parent,
						}
					);
					console.log(response.data);
					const el: any = document.getElementById(`reply-${values.parent}`);
					if (el.style.display === "none") el.style.display = "block";
					else el.style.display = "none";
					setCommentCount(commentCount + 1);
					actions.setSubmitting(false);
				}}
			>
				{(formik) => (
					<Form style={{ display: "none" }} id={`reply-${comment.uid}`}>
						<Field
							component={TextField}
							label="content"
							name="content"
							type="text"
							onChange={(e: any) => {
								console.log(e.target.name);
								formik.setFieldValue("content", e.target.value);
								formik.setFieldValue("user_id", user.user_id);
								formik.setFieldValue("post_id", post.uid);
								formik.setFieldValue("parent", comment.uid);
							}}
						/>
						<Field name="user_id" type="hidden" value={user.user_id} />
						<Field name="post_id" type="hidden" value={post.uid} />
						<Field name="parent" type="hidden" value={comment.uid} />
						<Button type={"submit"} variant="contained" size="small">
							post
						</Button>
						<Button
							variant="contained"
							size="small"
							onClick={(e: any) => {
								const el: any = document.getElementById(`reply-${comment.uid}`);
								if (el.style.display === "none") el.style.display = "block";
								else el.style.display = "none";
							}}
						>
							cancel
						</Button>
					</Form>
				)}
			</Formik>

			{/* edit form - appears when edit button is clicked */}
			<Formik
				initialValues={{
					content: comment.content || "",
				}}
				validationSchema={Yup.object({
					content: Yup.string().required("write a reply"),
				})}
				onSubmit={async (values, actions) => {
					console.log(values);
					const response = await axiosClient.patch(
						`http://127.0.0.1:8000/comments/${comment.uid}/`,
						{
							content: values.content,
						}
					);
					console.log(response.data);
					const el: any = document.getElementById(`edit-${comment.uid}`);
					if (el.style.display === "none") el.style.display = "block";
					else el.style.display = "none";
					setCommentCount(commentCount + 1);
					setCommentCount(commentCount - 1);
					actions.setSubmitting(false);
				}}
			>
				{(formik) => (
					<Form style={{ display: "none" }} id={`edit-${comment.uid}`}>
						<Field
							component={TextField}
							label="content"
							name="content"
							type="text"
							onChange={(e: any) => {
								console.log(e.target.name);
								formik.setFieldValue("content", e.target.value);
								formik.setFieldValue("user_id", user.user_id);
								formik.setFieldValue("post_id", post.uid);
								formik.setFieldValue("parent", comment.uid);
							}}
						/>
						<Field name="user_id" type="hidden" value={user.user_id} />
						<Field name="post_id" type="hidden" value={post.uid} />
						<Field name="parent" type="hidden" value={comment.uid} />
						<Button type={"submit"} variant="contained" size="small">
							post
						</Button>
						<Button
							variant="contained"
							size="small"
							onClick={(e: any) => {
								const el: any = document.getElementById(`edit-${comment.uid}`);
								if (el.style.display === "none") el.style.display = "block";
								else el.style.display = "none";
								// console.log(el);
							}}
						>
							cancel
						</Button>
					</Form>
				)}
			</Formik>

			{replies ? replies : null}
		</ul>
	);
};

const Post: NextPage<{ post: any; serverComments: any }> = ({
	post,
	serverComments,
}) => {
	const { query } = useRouter();
	const axiosClient = useAxiosClient();
	const { user } = useContext(userContext);
	const [comments, setComments] = useState(serverComments);
	const [commentCount, setCommentCount] = useState(post.comment_count);
	const getComments = async () => {
		const response = await axios.get(
			`http://127.0.0.1:8000/comments/post/${query.id}`
		);
		setComments(response.data);
	};
	useEffect(() => {
		getComments();
	}, [commentCount]);
	const getPostData = async () => {
		const response1 = await axios.get(
			`http://127.0.0.1:8000/posts/${query.id}`
		);
		const response2 = await axios.get(
			`http://127.0.0.1:8000/comments/post/${query.id}`
		);
		console.log(response1.data);
		console.log(response2.data);
	};
	useEffect(() => {
		getPostData();
	}, []);
	return (
		<>
			<Box component={"h3"}>{post.title}</Box>
			<Grid container>
				<Grid item>22 views</Grid>
				<Grid item>{commentCount} comments</Grid>
				<Grid item sx={{ position: "relative" }}>
					<Box sx={{ position: "absolute" }} className="categories">
						{post.category_id.map((category: any) => (
							<Link
								href={`http://localhost:3000/category/${category.uid}`}
								key={category.uid}
							>
								{category.name}
							</Link>
						))}
					</Box>
				</Grid>
			</Grid>
			<Box>
				<Image
					alt="sd"
					src={
						"data:image/jpeg;base64,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"
					}
					width={400}
					height={200}
				/>
			</Box>
			<Grid container>
				<Grid item xs={10}>
					<Box>
						<td dangerouslySetInnerHTML={{ __html: post.content }} />
					</Box>
					<Box>
						<Formik
							initialValues={{ content: "" }}
							validationSchema={Yup.object({
								content: Yup.string().required("write a comment"),
							})}
							onSubmit={async (values, actions) => {
								console.log(values);
								const response = await axiosClient.post(
									`http://127.0.0.1:8000/comments/`,
									{
										content: values.content,
										user_id: user.user_id,
										post_id: post.uid,
									}
								);
								console.log(response.data);
								setCommentCount(commentCount + 1);

								actions.setSubmitting(false);
							}}
						>
							<Form>
								<Field
									component={TextField}
									label="content"
									name="content"
									type="text"
								/>
								<Button type="submit" variant="contained">
									post
								</Button>
							</Form>
						</Formik>
					</Box>
					{comments.map((comment: any) => {
						return (
							<Comments
								key={comment.uid}
								comment={comment}
								commentReplies={comment.replies}
								post={post}
								user={user}
								commentCount={commentCount}
								setCommentCount={setCommentCount}
							/>
						);
					})}
				</Grid>

				<Grid item xs={2}>
					<Box>related posts</Box>
				</Grid>
			</Grid>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	res,
	query,
}) => {
	const response1 = await axios.get(`http://127.0.0.1:8000/posts/${query.id}`);
	const response2 = await axios.get(
		`http://127.0.0.1:8000/comments/post/${response1.data.uid}`
	);
	console.log(response1.data);
	console.log(response2.data);

	return {
		props: { post: response1.data, serverComments: response2.data },
	};
};
export default Post;
