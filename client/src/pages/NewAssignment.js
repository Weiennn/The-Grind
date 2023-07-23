import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { APICall } from "../helper/APICall";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import { useTheme } from "@emotion/react";
import { Typography, Button } from "@mui/material";
import { TextField } from "formik-material-ui";
import { Snackbar, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function NewAssignment() {
  const { authState } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [assignmentCreationMessage, setAssignmentCreationMessage] =
    useState("");
  const [showAssignmentCreationMessage, setShowAssignmentCreationMessage] =
    useState(false);
  const [recurringState, setRecurringState] = useState(false);
  const [deadlineLabel, setDeadlineLabel] = useState("Deadline");
  const id = authState.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const theme = useTheme();
  let navigate = useNavigate();

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (recurringState) {
      setDeadlineLabel("Start Date");
    } else {
      setDeadlineLabel("Deadline");
    }
  }, [recurringState]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const initialValues = {
    title: "",
    description: "",
    deadline: null,
    recurring: false,
    frequency: null,
  };

  const onSubmit = (data) => {
    data.deadline = selectedDate;
    if (data.deadline === null) {
      data.deadline = null;
    }
    axios
      .post(`${APICall}/assignments`, {
        ...data,
        completed: false,
        UserId: id,
      })
      .then((response) => {
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
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
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
              setRecurringState(false);
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
                label={deadlineLabel}
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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
                        onClick={(event) => {
                          setRecurringState(event.target.checked);
                        }}
                        id="recurring"
                        {...field}
                        checked={field.value}
                        sx={{ color: theme.palette.secondary.main }}
                      />
                    )}
                  </Field>
                </Box>
                {recurringState && (
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="frequency" size="small">
                      Frequency
                    </InputLabel>
                    <Field
                      id="frequency"
                      name="frequency"
                      as={Select}
                      variant="outlined"
                      size="small"
                      fullWidth
                      defaultValue={null}
                    >
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Biweekly">Biweekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                    </Field>
                  </FormControl>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ ml: 2 }}
                >
                  Create Assignment
                </Button>
              </Box>
            </Form>
          </Formik>
        </Box>
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
      <Box sx={{width: "75vw", mt: 2 }}>
        <Typography>FAQs:</Typography>
        <Typography>Q: What is a recurring assignment?</Typography>
        <Typography>
          A: A recurring assignment is an assignment that repeats itself. For
          example, if you have a weekly assignment, you can set the frequency to
          weekly and the assignment will repeat itself every week. For example,
          if you have a weekly assignment that starts on 10/10/2021, it will be re-added to your assignments page 
          on 17/10/2021, 24/10/2021 so that you do not have to manually add in the assignment.
        </Typography>
        <Typography>
          Q: What is the difference between a deadline and a start date?
        </Typography>
        <Typography>
          A: A deadline is the date that the assignment is due. A start date is
          the date that the recurring assignment will start. For example, if you
          have a weekly assignment that starts on 10/10/2021, the first
          assignment will be due on 17/10/2021 and the second assignment will be
          due on 24/17/2021.
        </Typography>
        <Typography>
          Q: What happens if I want to edit the assignment?
        </Typography>
        <Typography>
          A: You can edit the assignment by clicking on the field that you want
          to edit. For example, if you want to edit the title, you can click on
          the title field and edit the title.
        </Typography>
      </Box>
    </>
  );
}

export default NewAssignment;
