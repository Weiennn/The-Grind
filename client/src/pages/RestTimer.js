import React, { useState, useEffect } from 'react';

function RestTimer() {
    const [time, setTime] = useState(0);
    const [timerOn, setTimerOn] = useState(false);
    const [timer, setTimer] = useState(0);
    const [timerSet, setTimerSet] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    let hour = 0;
    let min = 0;
    let sec = 0;
  
    // Runs when the state timerOn is being changed
    useEffect(() => {
      let interval = null;
  
      if (timerOn) {
          interval = setInterval(() => {
              setTime(prevTime => prevTime + 10);
          }, 10);
      } else {
          clearInterval(interval);
      }
  
      return () => clearInterval(interval);
    }, [timerOn]);

    useEffect(() => {
        if (timer - time <= 0) {
            setTime(0);
            setTimerSet(false);
            setTimerOn(false);
        }
    }, [time]);
  
    return (
      <div>
        <div className="restLabel"> Rest </div>
        {timerSet ? (
            <>
            <div className="clock">
              <span className="hours">{Math.floor(((timer - time) / 3600000) % 24)} H: </span>
              <span className="minutes">{("0" + Math.floor(((timer - time) / 60000) % 60)).slice(-2)} MIN: </span>
              <span className="seconds">{("0" + Math.floor(((timer - time) / 1000) % 60)).slice(-2)} SEC: </span>
              <span className="milliseconds">{("00" + ((timer - time) % 1000)).slice(-3)} MS</span>
            </div>
            <div>
              {timerOn && (
                    <button onClick={() => 
                        {
                            setTimerOn(false);
                        }
                    }>
                        Pause
                    </button>
              )}
              {!timerOn && time > 0 && (
                  <>
                      <button onClick={() => setTimerOn(true)}>Resume</button>
                      <button onClick={() => 
                        {
                            setTime(0);
                            setTimerSet(false);
                            setTimerOn(false);
                        }
                      }>
                        Reset
                      </button>
                  </>       
              )}
            </div>
            </>
        ) : (
            <div>
                <span className="hourSetSpan"> Hours: <input type="number" className="hourInput" max="23" min="0" onChange={(event) => {hour = event.target.value;}} required/> </span>
                <span className="minuteSetSpan"> Minutes: <input type="number" className="minuteInput" max="59" min="0" onChange={(event) => {min = event.target.value;}} required/> </span>
                <span className="secondSetSpan"> Seconds: <input type="number" className="secondInput" max="59" min="0" onChange={(event) => {sec = event.target.value;}} required/> </span>
                <button onClick={() => {
                    setTimer((hour * 3600000) + (min * 60000) + (sec * 1000));
                    //if (timer > 0) {
                        setErrorMessage("");
                        setTimerSet(true);
                        setTimerOn(true);
                    /*} else {
                        setErrorMessage("Please insert a valid timing");
                    }*/
                }}> Start </button>
                <div> { errorMessage } </div>
            </div>
        )}
      </div>
    )
}

export default RestTimer
