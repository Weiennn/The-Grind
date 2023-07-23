import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helper/AuthContext";
import { APICall } from "../helper/APICall";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Card, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FilterListIcon from "@mui/icons-material/FilterList";
import ToggleButton from "@mui/material/ToggleButton";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import moment from "moment";

function Assignments() {
  const [listOfAssignments, setListOfAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const { authState } = useContext(AuthContext);
  const id = authState.id;
  const theme = useTheme();
  let navigate = useNavigate();

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    } else {
      axios.get(`${APICall}/assignments/${id}`).then((response) => {
        setListOfAssignments(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const listOfAssignments = axios.get(`${APICall}/assignments/${id}`);
    const formatAndSetAssignments = (lis) => {
      lis.forEach((assignment) => {
        if (assignment.deadline) {
          assignment.deadline = moment(
            assignment.deadline,
            "YYYY.MM.DD"
          ).format("DD.MM.YYYY");
        }
      });
      setListOfAssignments(lis);
    };

    if (filter === "all") {
      listOfAssignments.then((response) => {
        const filtered = response.data;
        formatAndSetAssignments(filtered);
      });
    } else if (filter === "recurring") {
      listOfAssignments.then((response) => {
        const filtered = response.data.filter(
          (assignment) => assignment.recurring === true
        );
        formatAndSetAssignments(filtered);
      });
    } else if (filter === "nonrecurring") {
      listOfAssignments.then((response) => {
        const filtered = response.data.filter(
          (assignment) => assignment.recurring === false
        );
        formatAndSetAssignments(filtered);
      });
    } else {
      // By deadline
      const haveDeadline = axios
        .get(`${APICall}/assignments/${id}`)
        .then((response) => {
          const filtered = response.data.filter(
            (assignment) =>
              assignment.deadline !== null &&
              assignment.deadline !== "Invalid date"
          );
          return filtered.sort((a, b) => {
            const deadlineA = moment(a.deadline, "YYYY.MM.DD");
            const deadlineB = moment(b.deadline, "YYYY.MM.DD");
            return deadlineA.diff(deadlineB);
          });
        });

      const noDeadline = listOfAssignments.then((response) => {
        const filtered = response.data.filter(
          (assignment) =>
            assignment.deadline === null ||
            assignment.deadline === "Invalid date"
        );
        return filtered;
      });

      Promise.all([haveDeadline, noDeadline]).then(
        ([haveDeadlineData, noDeadlineData]) => {
          const final = [...haveDeadlineData, ...noDeadlineData];
          formatAndSetAssignments(final);
        }
      );
    }
  }, [filter]);

  const edit = (option, id, key) => {
    if (key === undefined) {
      key = 0;
    }
    if (option === "title") {
      let newTitle = prompt("Enter new title");
      axios
        .put(`${APICall}/assignments/title`, {
          title: newTitle,
          id: id,
        })
        .then((response) => {
          const temp = [...listOfAssignments];
          temp[key] = { ...listOfAssignments[key], title: newTitle };
          setListOfAssignments(temp);
        });
    } else if (option === "description") {
      let newDesc = prompt("Enter new description");
      axios
        .put(`${APICall}/assignments/desc`, {
          description: newDesc,
          id: id,
        })
        .then((response) => {
          const temp = [...listOfAssignments];
          temp[key] = { ...listOfAssignments[key], description: newDesc };
          setListOfAssignments(temp);
        });
    } else {
      let newDeadline = prompt("Enter new deadline (YYYY-MM-DD)");
      axios
        .put(`${APICall}/assignments/deadline`, {
          deadline: newDeadline,
          id: id,
        })
        .then((response) => {
          const temp = [...listOfAssignments];
          temp[key] = { ...listOfAssignments[key], deadline: newDeadline };
          setListOfAssignments(temp);
        });
    }
  };

  const handleCheckboxClick = (id, key) => {
    // find the assignment with the id
    const assignment = listOfAssignments.find(
      (assignment) => assignment.id === id
    );
    // change the completed status
    axios
      .put(`${APICall}/assignments/completed`, {
        id: id,
        completed: !assignment.completed,
      })
      .then((response) => {
        if (response.data === "updated") {
          const temp = [...listOfAssignments];
          temp[key] = {
            ...listOfAssignments[key],
            completed: !listOfAssignments[key].completed,
          };
          setListOfAssignments(temp);
          setTimeout(() => {
            setListOfAssignments(
              listOfAssignments.filter((val) => {
                return val.id !== id;
              })
            );
          }, 300);
        } else {
          // deleted
          const temp = [...listOfAssignments];
          temp[key] = {
            ...listOfAssignments[key],
            completed: !listOfAssignments[key].completed,
          };
          setListOfAssignments(temp);
          setTimeout(() => {
            setListOfAssignments(
              listOfAssignments.filter((val) => {
                return val.id !== id;
              })
            );
          }, 300);
        }
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${APICall}/assignments/${id}`).then((response) => {
      setListOfAssignments(
        listOfAssignments.filter((val) => {
          return val.id !== id;
        })
      );
    });
  };

  const onFilterClick = () => {
    if (filter === "all") {
      setFilter("recurring");
    } else if (filter === "recurring") {
      setFilter("nonrecurring");
    } else if (filter === "nonrecurring") {
      setFilter("deadline");
    } else {
      setFilter("all");
    }
  };

  const handleResetRecurringClick = () => {
    axios
      .put(`${APICall}/assignments/resetRecurring/${id}`)
      .then((response) => {
        setListOfAssignments(response.data);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "78vw",
      }}
      data-testid="assignments-page"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          py: 1,
          flexGrow: 1,
          mb: 0.5,
        }}
      >
        <Typography
          variant="h4"
          component="h4"
          sx={{ flexGrow: 1, color: theme.palette.primary.main }}
        >
          Assignments
        </Typography>
        <ToggleButton
          value="add-assignment"
          data-testid="add-assignment-button"
          onClick={() => {
            navigate(`/newAssignment`);
          }}
        >
          <Typography
            variant="body1"
            component="label"
            sx={{ mr: 0.5, color: theme.palette.secondary.main }}
          >
            Add Assignment
          </Typography>
          <AddBoxIcon
            fontSize="medium"
            sx={{ color: theme.palette.secondary.main }}
          />
        </ToggleButton>
        <ToggleButton
          value="filter"
          onClick={onFilterClick}
          sx={{ ml: 2, color: theme.palette.secondary.main }}
        >
          <Typography variant="body1" component="h4" sx={{ flexGrow: 1 }}>
            {filter}
          </Typography>
          <FilterListIcon />
        </ToggleButton>
        <ToggleButton
          value="reset-recurring"
          onClick={handleResetRecurringClick}
          sx={{ ml: 2, color: theme.palette.secondary.main }}
        >
          <Typography variant="body1" component="h4" sx={{ flexGrow: 1 }}>
            Reset Recurring
          </Typography>
          <RestartAltIcon />
        </ToggleButton>
      </Box>
      <Divider />
      <Stack spacing={2} sx={{ mt: 2, flexGrow: 1 }}>
        {listOfAssignments.map((value, key) => (
          <Card
            key={key}
            elevation={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Checkbox
              data-testid={value.id}
              onClick={() => handleCheckboxClick(value.id, key)}
              checked={value.completed}
            />
            <Box
              sx={{
                padding: 1,
                borderColor: theme.palette.primary.main,
                flexGrow: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                },
              }}
              data-testid={`title-${key}`}
              onClick={() => {
                edit("title", value.id, key);
              }}
            >
              <Typography
                variant="body1"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {value.title}
              </Typography>
            </Box>
            {value.recurring && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EventRepeatIcon />
                <Typography
                  variant="body2"
                  component="div"
                  sx={{ color: theme.palette.primary.main, marginLeft: 1 }}
                >
                  Recurring {value.frequency === "None" ? null : value.frequency}{" "}
                  Task
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                padding: "10px",
                width: "13%",
                ml: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                edit("deadline", value.id, key);
              }}
            >
              {value.deadline === null || value.deadline === "Invalid date" ? (
                <Typography variant="body2" component="div">
                  Deadline: None
                </Typography>
              ) : (
                <Typography variant="body2" component="div">
                  Deadline: {value.deadline}
                </Typography>
              )}
            </Box>
            <DeleteIcon
              onClick={() => handleDelete(value.id)}
              data-testid={`delete-${value.id}`}
              sx={{ cursor: "pointer", color: theme.palette.secondary.main }}
            />
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default Assignments;
