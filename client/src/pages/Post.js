import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import {
  TextField,
  Button,
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function Post() {
  // id param from URL
  let { id } = useParams();
  // State containing post data
  const [postObject, setPostObject] = useState({});
  // State containing comment
  const [comments, setComments] = useState([]);
  // State containing comment body typed inside the input
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  // Runs when the page is being refreshed or loaded
  const theme = useTheme();

  useEffect(() => {
    // Get post data from the posts route and set the post state to it
    axios.get(`https://TimeTrekker.onrender.com/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });
    // Get comment data from the comments route and set the comment state to it
    axios.get(`https://TimeTrekker.onrender.com/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  // Function to add a comment
  const addComment = () => {
    let accessToken;
    if (authState.stay) {
      accessToken = localStorage.getItem("accessToken")
    } else {
      accessToken = sessionStorage.getItem("accessToken")
    }
    // Posting the comment into the comments route
    axios
      .post(
        "https://TimeTrekker.onrender.com/comments",
        { commentBody: newComment, PostId: id },
        {
          headers: {
            // Obtain token from local storage
            accessToken: accessToken,
          },
        }
      )
      .then((response) => {
        // Deal with any error
        if (response.data.error) {
          alert(response.data.error);
        } else {
          // Create a variable set to the comment object to be added
          const commentToAdd = {
            commentBody: response.data.commentBody,
            username: response.data.username,
            id: response.data.id,
          };
          // Add the variable to the state containing all comments
          setComments([...comments, commentToAdd]);
          // Reset the text input to be empty
          setNewComment("");
        }
      });
  };
  const deleteComment = (id) => {
    // Delete the comment from the comments route
    axios
      .delete(`https://TimeTrekker.onrender.com/comments/${id}`, {
        headers: {
          // Obtain token from local storage
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        // Filter out the comment from the state containing all comments
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          component={Paper}
          className="postContainer"
          sx={{
            width: "100%",
            border: "5px solid",
            maxWidth: "100%",
            borderColor: theme.palette.primary.main,
            padding: "20px",
            mb: "20px",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ mb: "10px" }}>
            {postObject.title}
          </Typography>
          <Typography
            variant="subtitle1"
            component="p"
            sx={{ color: theme.palette.text.secondary, mb: "10px" }}
          >
            {`Username: ${postObject.username}, Created on: ${
              postObject.createdAt ? postObject.createdAt.split("T")[0] : ""
            }`}
          </Typography>
          <Typography variant="body1" component="div" sx={{ mb: "20px" }}>
            {postObject.postText}
          </Typography>
        </Container>
        <Container
          className="commentContainer"
          sx={{
            width: "60%",
            padding: "20px",
            mb: "20px",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <TextField
            label="Add Comment"
            variant="outlined"
            fullWidth
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            sx={{ mb: "10px",  }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={addComment}
            sx={{
              mb: "10px",
              borderColor: theme.palette.primary.main,
            }}
          >
            Comment
          </Button>
          {comments.length > 0 ? (
            comments.map((comment, key) => (
              <Paper
                key={key}
                elevation={1}
                sx={{
                  border: "3px solid",
                  borderColor: theme.palette.primary.main,
                  mb: key === comments.length - 1 ? 0 : "10px",
                  padding: "10px",
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="body1" sx={{ mb: "5px" }}>
                  {comment.commentBody}
                </Typography>
                <Typography variant="body2">
                  Username: {comment.username}
                </Typography>
                {authState.username === comment.username && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => deleteComment(comment.id)}
                    sx={{ mt: "10px" }}
                  >
                    Delete
                  </Button>
                )}
              </Paper>
            ))
          ) : (
            <Typography variant="body1" sx={{ mb: "10px" }}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Container>
      </Box>
      {/* <div className="postPage">
        <div className="leftSide">
          <div className="post" id="individual">
            <div className="title">{postObject.title}</div>
            <div className="postText">{postObject.postText}</div>
            <div className="footer">{postObject.username}</div>
          </div>
        </div>
        <div className="rightSide">
          <div className="addCommentContainer">
            <input
              type="text"
              placeholder="Comment..."
              value={newComment}
              onChange={(event) => {
                setNewComment(event.target.value);
              }}
            />
            <button onClick={addComment}>Comment</button>
          </div>
          <div className="listOfComments">
            {comments.map((comment, key) => {
              return (
                <div key={key} className="comment">
                  {comment.commentBody}
                  <label> Username: {comment.username} </label>
                  {authState.username === comment.username && (
                    <button onClick={() => deleteComment(comment.id)}>X</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div> */}
    </>
  );
}

export default Post;
