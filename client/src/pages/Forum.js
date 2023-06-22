import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTheme } from "@emotion/react";

function Forum() {
  const [listOfPosts, setListOfPosts] = useState([]);
  let navigate = useNavigate();
  let theme = useTheme();

  // Runs when the page is being refreshed or loaded
  useEffect(() => {
    // Get data from the route for posts
    axios.get("http://localhost:3001/posts").then((response) => {
      setListOfPosts(response.data);
    });
  }, []);
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={6}
    >
      {listOfPosts.map((value, key) => {
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
            <Typography
              className="body"
              variant="h5"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {value.postText}
            </Typography>
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
