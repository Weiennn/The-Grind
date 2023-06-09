import React, { useContext } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helper/AuthContext";

function Registration() {
  // Obtaining state containing user login details
  const {setAuthState} = useContext(AuthContext);
  
  // initial values for the form
    const initialValues = {
        username: "",
        password: "",
    };

    // Requirements for form input
    const validationSchema = Yup.object().shape({
      username: Yup.string().min(3).max(15).required(),
      password: Yup.string().min(4).max(20).required(),
    })

    let navigate = useNavigate();

    // What happens when the submit button is clicked
  const onSubmit = (data) => {
    // Post data to the route for users
    axios.post("http://localhost:3001/auth", data).then(() => {
      // Send data to the route for user login
      axios.post("http://localhost:3001/auth/login", data).then((response) => {
        if (response.data.error) {
            alert(response.data.error);
        } else {
            // Set accessToken inside localStorage
            localStorage.setItem("accessToken", response.data.token);
            // When logging in, set status to be true to signify being logged in and obtain the username as well as id
            setAuthState({ username: response.data.username, id: response.data.id, status: true });
            // Change to home page
            navigate("/");
        }
      })
    });
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form class="formContainer">
            <label>Username: </label>
            <ErrorMessage name="username" component="span" />
            <Field
              id="inputNewPost"
              name="username"
              placeholder="John cena..."
            />
            <label>Password: </label>
            <ErrorMessage name="password" component="span" />
            <Field
              type="password"
              id="inputNewPost"
              name="password"
              placeholder="Password..."
            />
            <button type="submit"> Register </button>
        </Form>
      </Formik>
    </div>
  )
}

export default Registration
