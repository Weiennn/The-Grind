import React, { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";

function NewAssignment() {
    const { authState } = useContext(AuthContext);
    const id = authState.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const initialValues = {
        title: "",
        description: "",
        deadline: "",
        recurring: false
    };

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/assignments", {...data, UserId: id}).then((response) => {
            console.log(response);
        })
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("A title is required"),
        description: Yup.string().required("A description is required"),
        deadline: Yup.date().required("A date is required").min(today),
        recurring: Yup.boolean().required("Please select an option")
    })

    return (
        <div className="newAssignmentPage">
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className='formContainer'>
                    <label className="title">Title:</label>
                    <ErrorMessage name="title" component="span"/>
                    <Field
                        id="inputCreateAssignment"
                        name="title"
                        placeholder="Title..."
                    />
                    <label className="description">Description:</label>
                    <ErrorMessage name="description" component="span"/>
                    <Field
                        id="inputCreateAssignment"
                        name="description"
                        placeholder="Description..."
                    />
                    <label className="deadline">Deadline (YYYY-MM-DD):</label>
                    <ErrorMessage name="deadline" component="span"/>
                    <Field
                        id="inputCreateAssignment"
                        name="deadline"
                        placeholder="YYYY-MM-DD"
                    />
                    <label className="recurring">Recurring?</label>
                    <ErrorMessage name="recurring" component="span"/>
                    <Field
                        id="inputCreateAssignment"
                        name="recurring"
                        placeholder="true or false..."
                    />
                    <button type="submit"> Create Assignment </button>
                </Form>
            </Formik>
        </div>
  )
}

export default NewAssignment;
