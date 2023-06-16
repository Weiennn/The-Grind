import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

function Forum() {
  const [listOfPosts, setListOfPosts] = useState([]);
  let navigate = useNavigate();

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
            <Typography
              className="footer"
              variant="h5"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              -{value.username}
            </Typography>
          </Paper>
        );
      })}
    </Stack>
  );
}

export default Forum;
