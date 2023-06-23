import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "./pages/Navbar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const defaultTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#38945e",
      },
      secondary: {
        main: "#65ccb8",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <div className="App">
          <ThemeProvider theme={defaultTheme}>
            <Navbar />
          </ThemeProvider>
        </div>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
