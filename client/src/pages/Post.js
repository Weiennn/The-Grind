import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

function Post() {
  // id param from URL
  let { id } = useParams();
  // State containing post data
  const [postObject, setPostObject] = useState({});
  // State containing comment
  const [comments, setComments] = useState([]);
  // State containing comment body typed inside the input
  const [newComment, setNewComment] = useState("");

  // Runs when the page is being refreshed or loaded
  useEffect(() => {
    // Get post data from the posts route and set the post state to it
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });
    // Get comment data from the comments route and set the comment state to it
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  // Function to add a comment
  const addComment = () => {
    // Posting the comment into the comments route
    axios.post("http://localhost:3001/comments", {commentBody: newComment, PostId: id},
    {
      headers: {
        // Obtain token from local storage
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      // Deal with any error
      if (response.data.error) {
        alert(response.data.error);
      } else {
        // Create a variable set to the comment object to be added
        const commentToAdd = {commentBody: newComment, username: response.data.username}  
        // Add the variable to the state containing all comments
        setComments([...comments, commentToAdd])
        // Reset the text input to be empty
        setNewComment("");
      }
    });
  };
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className='title'>{postObject.title}</div>
          <div className='postText'>{postObject.postText}</div>
          <div className='footer'>{postObject.username}</div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer"> 
          <input
            type="text"
            placeholder='Comment...'
            value={newComment}
            onChange={(event) => {setNewComment(event.target.value)}} />
          <button onClick={addComment}>Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return ( <div key={key} className="comment">
              {comment.commentBody}
              <label> Username: {comment.username} </label>
            </div>
            );
          })}
        </div>
      </div>  
    </div>
  )
}

export default Post
