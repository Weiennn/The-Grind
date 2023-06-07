import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import Forum from "./pages/Forum";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { AuthContext } from "./helper/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  // Runs when the page is being refreshed or loaded
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
      if (response.data.error) {
        setAuthState({...authState, status: false});
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    })
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <Link to="newPost" >Create new post</Link>
            <Link to="/" >Forum</Link>
            {!authState.status ? (
              <>
                <Link to="/login" >Login</Link>
                <Link to="registration" >Registration</Link>
              </>
            ) : (
              <button onClick={logout}>Logout</button>
            )}

            <h1>{authState.username}</h1>
          </div>
          <Routes>
            <Route path="/" element={<Forum />} />
            <Route path="/newPost" element={<NewPost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </Router>
      </AuthContext.Provider> 
    </div>
  );
}

export default App;
