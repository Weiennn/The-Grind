import React, { useContext, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import { APICall } from "../helper/APICall";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { Typography, Button, } from "@mui/material";
import { TextField } from "formik-material-ui";

function NewPost() {
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();
  let theme = useTheme();

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    }
  }, []);

  // initial values for the form
  const initialValues = {
    title: "",
    postText: "",
  };

  // Requirements for form input
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("A title is required"),
    postText: Yup.string().required("A text body is required"),
  });

  const onSubmit = (data) => {
    let accessToken;
    if (authState.stay) {
      accessToken = localStorage.getItem("accessToken")
    } else {
      accessToken = sessionStorage.getItem("accessToken")
    }
    // Post data to the route for posts
    axios
      .post(`${APICall}/posts`, data, {
        headers: { accessToken: accessToken },
      })
      .then((response) => {
        // Navigate to another page after posting
        navigate("/");
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        border: "5px solid",
        borderColor: theme.palette.primary.main,
        p: 2,
      }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <Typography
            variant="h4"
            sx={{ mb: 2, color: theme.palette.primary.main }}
          >
            New Post
          </Typography>
          <Field
            id="inputCreatePost"
            name="title"
            label="Title"
            component={TextField}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Field
            id="inputCreatePost"
            name="postText"
            label="Post"
            multiline
            component={TextField}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" color="secondary">
              Create Post
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
}

export default NewPost;
