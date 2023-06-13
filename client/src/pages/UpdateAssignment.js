import React, { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';

function UpdateAssignment() {
    const { authState } = useContext(AuthContext);
    const userId = authState.id;
    let { id } = useParams();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let navigate = useNavigate();
    /*let title = "";
    let description = "";
    let deadline = "";
    let recurring = false;*/

    /*useEffect(() => {
        axios.get(`http://localhost:3001/assignments/updateAssignment/${id}`).then((response) => {
            title = response.data.title;
            description = response.data.description;
            deadline = response.data.deadline;
            recurring = response.data.recurring;
        })
    }, []);*/

    const initialValues = {
        title: "",
        description: "",
        deadline: "",
        recurring: false
    };

    const onSubmit = (data) => {
        console.log({...data, UserId: userId});
        axios.put(`http://localhost:3001/assignments/updateAssignment/${id}`, {...data, UserId: userId}).then((response) => {
            console.log(response);
        });
        /*navigate('/assignments');*/
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("A title is required"),
        description: Yup.string().required("A description is required"),
        deadline: Yup.date().required("A date is required").min(today),
        recurring: Yup.boolean().required("Please select an option")
    })

    return (
        <div className="updateAssignmentPage">
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className='formContainer'>
                    <label className="title">Title:</label>
                    <ErrorMessage name="title" component="span"/>
                    <Field
                        id="inputUpdateAssignment"
                        name="title"
                        placeholder="Title..."
                    />
                    <label className="description">Description:</label>
                    <ErrorMessage name="description" component="span"/>
                    <Field
                        id="inputUpdateAssignmentt"
                        name="description"
                        placeholder="Description..."
                    />
                    <label className="deadline">Deadline (YYYY-MM-DD):</label>
                    <ErrorMessage name="deadline" component="span"/>
                    <Field
                        id="inputUpdateAssignment"
                        name="deadline"
                        placeholder="YYYY-MM-DD"
                    />
                    <label className="recurring">Recurring?</label>
                    <ErrorMessage name="recurring" component="span"/>
                    <Field
                        id="inputUpdateAssignment"
                        name="recurring"
                        placeholder="true or false..."
                    />
                    <button type="submit"> Update Assignment </button>
                </Form>
            </Formik>
            <button onClick={() => {console.log(userId)}}>hi</button>
        </div>
  )
}

export default UpdateAssignment;
