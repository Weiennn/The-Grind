import React from 'react'
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helper/AuthContext";

function Assignments() {
    const [listOfAssignments, setListOfAssignments] = useState([]);
    const { authState } = useContext(AuthContext);
    const id = authState.id;

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
                        {value.recurring ? (
                            <button onClick={() => value.recurring = false}>Not recurring</button>
                        ) : (
                            <button onClick={() => value.recurring = true}>Recurring</button>
                        )}
                    </div>
                )
            })}
        </div>
  )
}

export default Assignments
