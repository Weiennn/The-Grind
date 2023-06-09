import React, { useState, useEffect } from 'react';

function Timer() {
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

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

  return (
    <div>
      <div className="clock">
        <span className="hours">{Math.floor((time / 3600000) % 24)} H: </span>
        <span className="minutes">{("0" + Math.floor((time / 60000) % 60)).slice(-2)} MIN: </span>
        <span className="seconds">{("0" + Math.floor((time / 1000) % 60)).slice(-2)} SEC: </span>
        <span className="milliseconds">{("0" + ((time / 10) % 100)).slice(-2)} MS</span>
      </div>
      <div>
        {!timerOn && time === 0 && (
            <button onClick={() => setTimerOn(true)}>Start</button>
        )}
        {timerOn && (
            <button onClick={() => setTimerOn(false)}>Stop</button>
        )}
        {!timerOn && time > 0 && (
            <>
                <button onClick={() => setTimerOn(true)}>Resume</button>
                <button onClick={() => setTime(0)}>Reset</button>
            </>       
        )}
      </div>
    </div>
  )
}

export default Timer
