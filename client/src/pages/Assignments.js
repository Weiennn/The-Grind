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
    
    const edit = (option, id, key) => {
        if (option === "title") {
            let newTitle = prompt("Enter new title");
            axios.put("http://localhost:3001/assignments/title", { title: newTitle, id: id }).then((response) => {
                console.log(response);
                const temp = [...listOfAssignments];
                temp[key] = {...listOfAssignments[key], title: newTitle};
                setListOfAssignments(temp);
            });
        } else if (option === "description") {
            let newDesc = prompt("Enter new description");
            axios.put("http://localhost:3001/assignments/desc", { description: newDesc, id: id }).then((response) => {
                console.log(response);
                const temp = [...listOfAssignments];
                temp[key] = {...listOfAssignments[key], description: newDesc};
                setListOfAssignments(temp);
            });
        } else {
            let newDeadline = prompt("Enter new deadline (YYYY-MM-DD)");
            axios.put("http://localhost:3001/assignments/deadline", { deadline: newDeadline, id: id }).then((response) => {
                console.log(response);
                const temp = [...listOfAssignments];
                temp[key] = {...listOfAssignments[key], deadline: newDeadline};
                setListOfAssignments(temp);
            });
        }
    }

    return (
        <div>
            {listOfAssignments.map((value, key) => {
                return (
                    <div className="assignment">
                        <div className="title" onClick={ () => { edit("title", value.id, key) } }> {value.title} </div>
                        <div className="description" onClick={ () => { edit("description", value.id, key) } }> {value.description} </div>
                        <div className="deadline" onClick={ () => { edit("deadline", value.id, key) } }> {value.deadline} </div>
                        <button> Nothing </button>
                    </div>
                )
            })}
        </div>
  )
}

export default Assignments
