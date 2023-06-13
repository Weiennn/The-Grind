import React from 'react'
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helper/AuthContext";
import { useNavigate } from "react-router-dom";

function Assignments() {
    const [listOfAssignments, setListOfAssignments] = useState([]);
    const { authState } = useContext(AuthContext);
    const id = authState.id;
    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/assignments/${id}`).then((response) => {
            setListOfAssignments(response.data);
        })
    }, [])
    
    return (
        <div>
            {listOfAssignments.map((value, key) => {
                return (
                    <div className="assignment">
                        <div className="title"> {value.title} </div>
                        <div className="description"> {value.description} </div>
                        <div className="deadline"> {value.deadline} </div>
                        <button onClick={() => navigate(`/updateAssignment/${value.id}`)}>Edit</button>
                    </div>
                )
            })}
        </div>
  )
}

export default Assignments
