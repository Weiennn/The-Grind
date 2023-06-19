import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Timer() {
  let navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/studyTimer")}> Study </button>
      <button onClick={() => navigate("/restTimer")}> Rest </button>
    </div>
  )
}

export default Timer
