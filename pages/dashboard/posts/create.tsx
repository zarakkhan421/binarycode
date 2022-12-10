import { NextPage } from "next";
import Dashboard from "../../../components/Dashboard";
import { Box, Grid, Button, MenuItem } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField, Select, Checkbox } from "formik-mui";
import * as Yup from "yup";
import useAxiosClient from "../../../utils/axiosClient";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../_app";
import axios from "axios";
// import { Quill } from "quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
// import dynamic from "next/dynamic";
// const Editor = dynamic(
// 	() => import("react-draft-wysiwyg").then((mod) => mod.Editor),
// 	{ ssr: false }
// );
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// class EditorConvertToHTML extends React.Component {
// 	state = {
// 		editorState: EditorState.createEmpty(),
// 	};

// 	onEditorStateChange = (editorState: any) => {
// 		this.setState({
// 			editorState,
// 		});
// 	};

// 	render() {
// 		const { editorState }: any = this.state;
// 		return (
// 			<div>
// 				<Editor
// 					editorState={editorState}
// 					wrapperClassName="demo-wrapper"
// 					editorClassName="demo-editor"
// 					onEditorStateChange={this.onEditorStateChange}
// 				/>
// 				{/* <textarea
// 					disabled
// 					value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
// 				/> */}
// 			</div>
// 		);
// 	}
// }

const Categories = ({ category, categoryChildren, i }: any) => {
	let children = null;
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
		<ul style={{ listStyle: "none", paddingInlineStart: 20 }}>
			<label>
				<Field
					component={Checkbox}
					type="checkbox"
					name="categories"
					sx={{
						padding: 0.5,
					}}
					value={`${category.uid}`}
				/>
				{i + " " + category.name}
				{children ? children : null}
			</label>
		</ul>
	);
};

const Create = () => {
	const axiosClient = useAxiosClient();
	const { user } = useContext(userContext);
	const [categories, setCategories] = useState<any>([]);
	// const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [value, setValue] = useState("");

	const getCategories = async () => {
		const response = await axios.get(`http://127.0.0.1:8000/categories/`);
		console.log("res", response.data);
		setCategories(response.data);
	};
	useEffect(() => {
		getCategories();
	}, []);
	// var editor = new Quill("#editor");
	return (
		<>
			{/* <Box> */}
			<Formik
				initialValues={{
					title: "",
					content: "",
					status: "",
					excerpt: "",
					categories: [],
				}}
				validationSchema={Yup.object({
					title: Yup.string().required("please enter a title"),
					status: Yup.string()
						.required("please choose a status")
						.oneOf(["published", "draft", "unpublished"]),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					const post = await axiosClient.post(
						`http://127.0.0.1:8000/posts/create/`,
						{
							title: values.title,
							content: value,
							status: values.status,
							excerpt: values.excerpt,
							user_id: user.user_id,
							category_id: values.categories,
						}
					);
					console.log(values);
					console.log(post);

					setSubmitting(false);
				}}
			>
				<Form>
					<Grid container>
						<Grid item xs={8}>
							<Grid container>
								<Grid item xs={12}>
									<Field
										component={TextField}
										label="Title"
										name="title"
										type="text"
									/>
								</Grid>
								<Grid item xs={12}>
									{/* <Field
										component={TextField}
										label="Content"
										name="content"
										type="text"
									/> */}
									{/* <EditorConvertToHTML /> */}
									{/* <Editor
										editorState={editorState}
										wrapperClassName="demo-wrapper"
										editorClassName="demo-editor"
										toolbarClassName="toolbar-class"
										onEditorStateChange={(editorState) => {
											setEditorState(editorState);
										}}
										toolbar={{
											options: [
												"inline",
												"blockType",
												"fontSize",
												"fontFamily",
												"list",
												"textAlign",
												"colorPicker",
												"link",
												"embedded",
												"emoji",
												"image",
												"history",
											],
											inline: { inDropdown: true },
											list: { inDropdown: true },
											textAlign: { inDropdown: true },
											link: { inDropdown: true },
											history: { inDropdown: true },
										}}
									/> */}
									<ReactQuill
										theme="snow"
										value={value}
										onChange={setValue}
										modules={{
											toolbar: [
												[{ header: [1, 2, false] }],
												["bold", "italic", "underline", "strike", "blockquote"],
												[
													{ list: "ordered" },
													{ list: "bullet" },
													{ indent: "-1" },
													{ indent: "+1" },
												],
												["link", "image"],
												["clean"],
											],
										}}
										formats={[
											"header",
											"bold",
											"italic",
											"underline",
											"strike",
											"blockquote",
											"list",
											"bullet",
											"indent",
											"link",
											"image",
										]}
									/>
									<textarea disabled value={value} />
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={4}>
							<Grid container>
								<Grid item xs={12} sx={{ height: 200, overflowY: "scroll" }}>
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
								</Grid>
								<Grid item xs={12}>
									<Field
										component={Select}
										name="status"
										label="Choose Status"
										as={"select"}
										sx={{ width: 200 }}
									>
										<MenuItem value="published">Published</MenuItem>
										<MenuItem value="draft">Draft</MenuItem>
										<MenuItem value="unpublished">UnPublish</MenuItem>
									</Field>
								</Grid>
								<Grid item xs={12}>
									<Field
										component={TextField}
										label="Excerpt"
										name="excerpt"
										type="text"
									/>
								</Grid>
								<Grid item xs={12}>
									<Button type="submit" variant="contained">
										save
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Form>
			</Formik>
			{/* </Box> */}
		</>
	);
};
export default Create;
