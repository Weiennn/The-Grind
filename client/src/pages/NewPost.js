import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewPost() {

  let navigate = useNavigate();

  // initial values for the form
  const initialValues = {
        title: "",
        postText: "",
        username: "",
    };

    // Requirements for form input
    const validationSchema = Yup.object().shape({
      title: Yup.string().required("A title is required"),
      postText: Yup.string().required("A text body is required"),
      username: Yup.string().min(3).max(15).required("A username is required")
    })

  // What happens when the submit button is clicked
  const onSubmit = (data) => {
    // Post data to the route for posts
    axios.post("http://localhost:3001/posts", data).then((response) => {
        // Navigate to another page after posting
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
              id="inputCreatePost"
              name="title"
              placeholder="Title..."
            />
            <label>Post: </label>
            <ErrorMessage name="postText" component="span" />
            <Field
              id="inputCreatePost"
              name="postText"
              placeholder="Post..."
            />
            <label>Username: </label>
            <ErrorMessage name="username" component="span" />
            <Field
              id="inputCreatePost"
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
