import React, { Component, useContext, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import { useTheme } from "@emotion/react";
import { Typography, Button, FormControlLabel, Container } from "@mui/material";
import { TextField } from "formik-material-ui";
import { Snackbar, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

function NewAssignment(props) {
  const { authState } = useContext(AuthContext);
  const id = authState.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [assignmentCreationMessage, setAssignmentCreationMessage] =
    useState("");
  const [showAssignmentCreationMessage, setShowAssignmentCreationMessage] =
    useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    }
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const initialValues = {
    title: "",
    description: "",
    deadline: null,
    recurring: false,
  };

  const onSubmit = (data) => {
    data.deadline = selectedDate;
    if (data.deadline === null) {
      data.deadline = null;
    }
    axios
      .post("http://localhost:3001/assignments", {
        // https://TimeTrekker.onrender.com/assignments
        ...data,
        completed: false,
        UserId: id,
      })
      .then((response) => {
        console.log(response);
        setAssignmentCreationMessage(
          `Assignment ${response.data.title} created successfully!`
        );
        setShowAssignmentCreationMessage(true);
      });
  };

  const handleCloseAssignmentCreationMessage = () => {
    setShowAssignmentCreationMessage(false);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("A title is required"),
    // description: Yup.string().required("A description is required"),
    recurring: Yup.boolean().required("Please select an option"),
  });

  return (
    <>
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
          onSubmit={(values, { resetForm }) => {
            onSubmit(values);
            resetForm();
            setSelectedDate(null);
          }}
          validationSchema={validationSchema}
        >
          <Form className="formContainer">
            <Typography
              variant="h4"
              sx={{ mb: 2, color: theme.palette.primary.main }}
            >
              New Assignment
            </Typography>
            <Field
              id="inputCreateAssignment"
              name="title"
              label="Title"
              component={TextField}
              fullWidth
              variant="outlined"
            />
            <DatePicker
              label="Deadline"
              value={selectedDate}
              onChange={handleDateChange}
              sx={{
                mt: 2,
                mb: 2,
                color: theme.palette.primary.main,
                width: "100%",
                height: "100%",
              }}
              inputFormat="DD-MM-YYYY"
              fullWidth
              PopperProps={{ style: { width: "100%" } }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography
                  variant="body3"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Recurring?
                </Typography>
                <Field name="recurring">
                  {({ field }) => (
                    <Switch
                      id="recurring"
                      {...field}
                      checked={field.value}
                      sx={{ color: theme.palette.secondary.main }}
                    />
                  )}
                </Field>
              </Box>
              <Button type="submit" variant="contained" color="secondary">
                Create Assignment
              </Button>
            </Box>
          </Form>
        </Formik>
      </Box>
      <Snackbar
        open={showAssignmentCreationMessage}
        autoHideDuration={3000}
        onClose={handleCloseAssignmentCreationMessage}
        message={assignmentCreationMessage}
        action={
          <IconButton
            size="small"
            onClick={handleCloseAssignmentCreationMessage}
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </>
  );
}

export default NewAssignment;
