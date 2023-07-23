import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helper/AuthContext";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { APICall } from "../helper/APICall";
import moment from "moment";

function Forum() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [allPosts, setAllPosts] = useState([]);
  let navigate = useNavigate();
  let theme = useTheme();

  // Runs when the page is being refreshed or loaded
  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    } else {
      axios.get(`${APICall}/posts`).then((response) => {
        setListOfPosts(response.data);
      });
    }
    // Get data from the route for posts
    axios.get(`${APICall}/posts`).then((response) => {
      setListOfPosts(response.data);
      setAllPosts(response.data);
    });
  }, []);

  useEffect(() => {
    console.log("check");
    if (filter === "week") {
      setListOfPosts(
        listOfPosts
          .slice()
          .filter((post) =>
            moment(post.createdAt).isAfter(moment().subtract(7, "days"))
          )
      );
    } else if (filter === "month") {
      if (sort === "recent") {
        setListOfPosts(
          allPosts
            .slice()
            .filter((post) =>
              moment(post.createdAt).isAfter(moment().subtract(1, "months"))
            )
        );
      } else {
        setListOfPosts(
          allPosts
            .slice()
            .reverse()
            .filter((post) =>
              moment(post.createdAt).isAfter(moment().subtract(1, "months"))
            )
        );
      }
    } else {
      setListOfPosts(allPosts);
    }
  }, [filter]);

  useEffect(() => {
    setListOfPosts(listOfPosts.slice().reverse());
  }, [sort]);

  const filterPosts = (event) => {
    setFilter(event.target.value);
  };

  const sortPosts = (event) => {
    setSort(event.target.value);
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={6}
    >
      <TextField
        type="text"
        label="Search posts..."
        className="search"
        onChange={(event) => setQuery(event.target.value)}
      ></TextField>
      <FormControl fullWidth>
        <InputLabel>Filter:</InputLabel>
        <Select value={filter} label="Filter" onChange={filterPosts}>
          <MenuItem value={"all"}>All</MenuItem>
          <MenuItem value={"week"}>Past Week</MenuItem>
          <MenuItem value={"month"}>Past Month</MenuItem>
          <MenuItem value={"friends"}>Friends</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Sort by:</InputLabel>
        <Select value={sort} label="Sort by" onChange={sortPosts}>
          <MenuItem value={"recent"}>Most Recent</MenuItem>
          <MenuItem value={"old"}>Oldest</MenuItem>
        </Select>
      </FormControl>
      {listOfPosts
        .filter((post) => post.title.toLowerCase().includes(query))
        .reverse()
        .map((value, key) => {
          return (
            <Paper
              component="div"
              color="secondary"
              className="post"
              bordercolor="primary"
              elevation={3}
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
              sx={{
                minWidth: "50vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "100px",
                maxHeight: "fit-content", // Adjust the maximum height as needed
              }}
            >
              <Box
                component="div"
                classname="postTitleContainer"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                <Typography
                  className="title"
                  variant="h5"
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  {value.title}
                </Typography>
              </Box>
              <Box sx={{display: "flex", alignContent: "center", justifyContent: "center", padding: 4}}>
                <Typography
                  className="body"
                  variant="h5"
                  component="div"
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  {value.postText.slice(0, 200) + "..."}
                </Typography>
              </Box>
              <Box
                component="div"
                classname="postTitleContainer"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                <Typography
                  className="title"
                  variant="h5"
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  - {value.username}
                </Typography>
              </Box>
            </Paper>
          );
        })}
    </Stack>
  );
}

export default Forum;
