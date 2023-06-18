import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helper/AuthContext";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Card, Container, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FilterListIcon from "@mui/icons-material/FilterList";
import ToggleButton from "@mui/material/ToggleButton";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import { alignProperty } from "@mui/material/styles/cssUtils";

function Assignments() {
  const [listOfAssignments, setListOfAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const { authState } = useContext(AuthContext);
  const id = authState.id;
  let navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    axios.get(`http://localhost:3001/assignments`).then((response) => {
      setListOfAssignments(response.data);
      //console.log(response.data[0].title);
    });
  }, []);

  const edit = (option, id, key) => {
    if (key === undefined) {
      key = 0;
    }
    if (option === "title") {
      let newTitle = prompt("Enter new title");
      axios
        .put("http://localhost:3001/assignments/title", {
          title: newTitle,
          id: id,
        })
        .then((response) => {
          console.log(response);
          const temp = [...listOfAssignments];
          temp[key] = { ...listOfAssignments[key], title: newTitle };
          setListOfAssignments(temp);
        });
    } else if (option === "description") {
      let newDesc = prompt("Enter new description");
      axios
        .put("http://localhost:3001/assignments/desc", {
          description: newDesc,
          id: id,
        })
        .then((response) => {
          console.log(response);
          const temp = [...listOfAssignments];
          temp[key] = { ...listOfAssignments[key], description: newDesc };
          setListOfAssignments(temp);
        });
    } else {
      let newDeadline = prompt("Enter new deadline (YYYY-MM-DD)");
      axios
        .put("http://localhost:3001/assignments/deadline", {
          deadline: newDeadline,
          id: id,
        })
        .then((response) => {
          console.log(response);
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
      .put("http://localhost:3001/assignments/completed", {
        id: id,
        completed: !assignment.completed,
      })
      .then((response) => {
        if (response.data == "updated") {
          const temp = [...listOfAssignments];
          temp[key] = {
            ...listOfAssignments[key],
            completed: !listOfAssignments[key].completed,
          };
          setListOfAssignments(temp);
        } else {
          setListOfAssignments(
            listOfAssignments.filter((val) => {
              return val.id != id;
            })
          );
        }
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "80vw" }}>
      <Container sx={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <Typography variant="h4" component="h4" sx={{ flexGrow: 1 }}>
          Assignments
        </Typography>
        <ToggleButton value="filter">
          <FilterListIcon />
        </ToggleButton>
      </Container>
      <Divider />
      <Stack spacing={2} sx={{ mt: 2 }}>
        {listOfAssignments.map((value, key) => (
          <Card
            key={key}
            elevation={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Checkbox
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
                  sx={{ color: theme.palette.secondary.main, marginLeft: 1 }}
                >
                  Recurring Task
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                padding: "10px",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                edit("deadline", value.id, key);
              }}
            >
              <Typography variant="body2" component="div">
                Deadline: {value.deadline}
              </Typography>
            </Box>
          </Card>
        ))}
      </Stack>
    </Box>
  );

  //     return (
  //         <Box sx={{display: "flex", flexDirection: "column", width: "100vh"}}>
  //             <Typography variant="h4" component="h4">
  //                 Assignments
  //             </Typography>
  //             <Divider />
  //             <Stack>
  //             {listOfAssignments.map((value, key) => {
  //                 return (
  //                     <Card elevation={3} sx={{ margin: 1, mt: 1, mb: 2,}}>
  //                         <div className="title" onClick={ () => { edit("title", value.id, key) } }> {value.title} </div>
  //                         <div className="description" onClick={ () => { edit("description", value.id, key) } }> {value.description} </div>
  //                         <div className="deadline" onClick={ () => { edit("deadline", value.id, key) } }> {value.deadline} </div>
  //                     </Card>
  //                 )
  //             })}
  //             </Stack>
  //         </Box>
  //   )
}

export default Assignments;
