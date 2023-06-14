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
            //console.log(response.data[0].title);
        })
    }, [])
    
    const edit = (option, id) => {
        if (option === "title") {
            let newTitle = prompt("Enter new title");
            axios.put("http://localhost:3001/assignments/title", { title: newTitle, id: id }).then((response) => {
                console.log(response);
                setListOfAssignments(...listOfAssignments, listOfAssignments[id] = {...listOfAssignments[id], title: newTitle});
            });
        } else if (option === "description") {
            let newDesc = prompt("Enter new description");
            axios.put("http://localhost:3001/assignments/desc", { description: newDesc, id: id }).then((response) => {
                console.log(response);
                setListOfAssignments(...listOfAssignments, listOfAssignments[id] = {...listOfAssignments[id], description: newDesc});
            });
        } else {
            let newDeadline = prompt("Enter new deadline");
            axios.put("http://localhost:3001/assignments/deadline", { deadline: newDeadline, id: id }).then((response) => {
                console.log(response);
                setListOfAssignments(...listOfAssignments, listOfAssignments[id] = {...listOfAssignments[id], deadline: newDeadline});
            });
        }
    }

    return (
        <div>
            {listOfAssignments.map((value, key) => {
                return (
                    <div className="assignment">
                        <div className="title" onClick={ () => { edit("title", value.id) } }> {value.title} </div>
                        <div className="description" onClick={ () => { edit("description", value.id) } }> {value.description} </div>
                        <div className="deadline" onClick={ () => { edit("deadline", value.id) } }> {value.deadline} </div>
                    </div>
                )
            })}
        </div>
  )
}

export default Assignments
