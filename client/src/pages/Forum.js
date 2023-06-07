import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div className="post" onClick={() => {navigate(`/post/${value.id}`)}}>
            <div className="title"> {value.title} </div>
            <div className="body"> {value.postText} </div>
            <div className="footer"> - {value.username} </div>
          </div>
        );
      })}
    </div>
  )
}

export default Forum
