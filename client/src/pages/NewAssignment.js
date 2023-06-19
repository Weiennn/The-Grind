import React, { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import { useTheme } from '@emotion/react';

function NewAssignment(props) {
    const { authState } = useContext(AuthContext);
    const id = authState.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const theme = useTheme();

    const [selectedDate, setSelectedDate] = React.useState(null);

    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    const initialValues = {
        title: "",
        description: "",
        deadline: "",
        recurring: false
    };

    const onSubmit = (data) => {
        data.deadline = selectedDate;
        if (data.deadline === null) {
            data.deadline = null;
        }
        axios.post("http://localhost:3001/assignments", {...data, completed: false, UserId: id}).then((response) => {
            console.log(response);
        })
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("A title is required"),
        description: Yup.string().required("A description is required"),
        // deadline: Yup.date().required("A date is required").min(today),
        recurring: Yup.boolean().required("Please select an option")
    })

    return (
      <Box
        sx={{
          color: theme.palette.primary.main,
          bordercolor: theme.palette.primary.main,
          border: "5px solid",
        }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="formContainer">
            <label className="title">Title:</label>
            <ErrorMessage name="title" component="span" />
            <Field
              id="inputCreateAssignment"
              name="title"
              placeholder="Title..."
            />
            <label className="description">Description:</label>
            <ErrorMessage name="description" component="span" />
            <Field
              id="inputCreateAssignment"
              name="description"
              placeholder="Description..."
            />
            <label className="deadline">Deadline (DD-MM-YYYY):</label>
            {/* <ErrorMessage name="deadline" component="span" />
            <Field
              id="inputCreateAssignment"
              name="deadline"
              placeholder="YYYY-MM-DD"
            /> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Deadline"
                value={selectedDate}
                onChange={handleDateChange}
                sx={{
                  height: "50px",
                  color: theme.palette.secondary.main,
                }}
              />
            </LocalizationProvider>
            <label className="recurring">Recurring?</label>
            <ErrorMessage name="recurring" component="span" />
            <Field name="recurring">
              {({ field }) => <Switch id="recurring" {...field} />}
            </Field>
            <button
              type="submit"
              color="primary"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderColor: theme.palette.primary.main,
              }}
            >
              Create Assignment
            </button>
          </Form>
        </Formik>
      </Box>
    );
}

export default NewAssignment;
