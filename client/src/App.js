import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "./pages/Navbar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { StytchHeadlessClient } from "@stytch/vanilla-js/headless";
import { StytchToken } from "./helper/StytchToken";
import { StytchProvider } from "@stytch/react";

function App() {

  const stytchClient = new StytchHeadlessClient(
    `${StytchToken}`
  );

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
            <StytchProvider stytch={stytchClient}>
              <Navbar />
            </StytchProvider>
          </ThemeProvider>
        </div>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
