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
import image from "../../public/placeholder-image.webp";

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
				<Grid item marginRight={1}>
					22 views
				</Grid>
				<Grid item marginRight={1}>
					{commentCount} comments
				</Grid>
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

			<Image alt="blog-image" src={image} style={{ objectFit: "cover" }} />

			<Grid container>
				<Grid item>
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
				{/* 
				<Grid item xs={2}>
					<Box>related posts</Box>
				</Grid> */}
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
