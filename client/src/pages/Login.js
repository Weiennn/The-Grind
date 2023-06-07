import React, { useState, useContext } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helper/AuthContext";

function Login() {
    // State containing username typed in input
    const [username, setUsername] = useState("");
    // State containing password typed in input
    const [password, setPassword] = useState("");
    // Obtaining state containing user login details
    const {setAuthState} = useContext(AuthContext);

    let navigate = useNavigate();

    // Function that is called when the login button is clicked
    const login = () => {
        // Data containing username and password
        const data = { username: username, password: password };
        // Send data to the route for user login
        axios.post("http://localhost:3001/auth/login", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                // Set accessToken inside localStorage
                localStorage.setItem("accessToken", response.data.token);
                // When logging in, set status to be true to signify being logged in and obtain the username as well as id
                setAuthState({ username: response.data.username, id: response.data.id, status: true });
                // Change to home page
                navigate("/");
            }
        })
    };
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
        setUsername(event.target.value);
      }} />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
        setPassword(event.target.value);
      }} />
    
      <button onClick={login}>Login</button>
    </div>
  )
}

export default Login
