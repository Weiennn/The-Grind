import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewPost() {

  let navigate = useNavigate();

  const initialValues = {
        title: "",
        postText: "",
        username: "",
    };

    const validationSchema = Yup.object().shape({
      title: Yup.string().required(),
      postText: Yup.string().required(),
      username: Yup.string().min(3).max(15).required()
    })

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/posts", data).then((response) => {
        navigate("/");
      });
    };
  
  return (
    <div className="newPostPage">
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form class="formContainer">
            <label>Title: </label>
            <ErrorMessage name="title" component="span" />
            <Field
              id="inputNewPost"
              name="title"
              placeholder="Title..."
            />
            <label>Post: </label>
            <ErrorMessage name="postText" component="span" />
            <Field
              id="inputNewPost"
              name="postText"
              placeholder="Post..."
            />
            <label>Username: </label>
            <ErrorMessage name="username" component="span" />
            <Field
              id="inputNewPost"
              name="username"
              placeholder="John cena..."
            />
            <button type="submit"> Create Post </button>
        </Form>
      </Formik>
    </div>
  )
}

export default NewPost
