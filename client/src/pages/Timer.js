import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Divider,
} from "@mui/material";
import { AuthContext } from "../helper/AuthContext";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState("work");
  const [sliderDuration, setSliderDuration] = useState(25);
  const [workTimerDuration, setWorkTimerDuration] = useState(25);
  const [breakTimerDuration, setBreakTimerDuration] = useState(5);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  let theme = useTheme();

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    } else {
      let interval = null;

      if (isActive) {
        interval = setInterval(() => {
          if (seconds > 0) {
            setSeconds(seconds - 1);
          } else {
            if (minutes === 0) {
              // Timer has reached 0
              clearInterval(interval);
              setIsActive(false);
              // Switch between work and break session
              if (sessionType === "work") {
                setSessionType("break");
                setMinutes(breakTimerDuration);
                setSliderDuration(breakTimerDuration);
                setSeconds(0);
              } else {
                setSessionType("work");
                setMinutes(workTimerDuration);
                setSliderDuration(workTimerDuration);
                setSeconds(0);
              }
            } else {
              setMinutes(minutes - 1);
              setSeconds(59);
            }
          }
        }, 1000);
      }
      return () => clearInterval(interval);
    }
  }, [
    isActive,
    minutes,
    seconds,
    sessionType,
    sliderDuration,
    workTimerDuration,
    breakTimerDuration,
  ]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSessionType("work");
    setMinutes(workTimerDuration);
    setSliderDuration(workTimerDuration);
    setSeconds(0);
  };

  const handleTimerDurationChange = (event, value) => {
    if (sessionType === "work") {
      setWorkTimerDuration(value);
      setSliderDuration(workTimerDuration);
      setMinutes(workTimerDuration);
    } else {
      setBreakTimerDuration(value);
      setSliderDuration(breakTimerDuration);
      setMinutes(breakTimerDuration);
    }
    setSeconds(0);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        width: "50vw",
        border: "5px solid",
        borderColor: theme.palette.primary.main,
        p: 2,
      }}
    >
      <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
        Pomodoro Timer
      </Typography>
      <Divider sx={{ width: "100%", mb: 2 }} />
      <Typography
        variant="h2"
        align="center"
        sx={{ mb: 2 }}
        data-testid="timer-time"
      >
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </Typography>
      <FormControl sx={{ mb: 2 }}>
        <InputLabel id="session-type-label">Session Type</InputLabel>
        <Select
          label="session-type-label"
          id="session-type"
          value={sessionType}
          onChange={(e) => {
            setSessionType(e.target.value);
            if (e.target.value === "work") {
              setMinutes(workTimerDuration);
              setSliderDuration(workTimerDuration);
              setSeconds(0);
            } else {
              setMinutes(breakTimerDuration);
              setSliderDuration(breakTimerDuration);
              setSeconds(0);
            }
          }}
        >
          <MenuItem value="work">Work</MenuItem>
          <MenuItem value="break">Break</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ width: "80%", mb: 2 }}>
        <InputLabel id="timer-duration-label">Timer Duration</InputLabel>
        <Slider
          label="timer-duration-label"
          data-testid="timer-duration"
          id="timer-duration"
          value={sliderDuration}
          min={1}
          max={60}
          step={1}
          onChange={handleTimerDurationChange}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleToggle}
        sx={{ mb: 2 }}
      >
        {isActive ? "Pause" : "Start"}
      </Button>
      <Button variant="outlined" onClick={handleReset}>
        Reset
      </Button>
    </Box>
  );
};

export default PomodoroTimer;

