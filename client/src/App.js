import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "./pages/Navbar";

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
    <div className="App">
      <ThemeProvider theme={defaultTheme}>
        <Navbar />
      </ThemeProvider>
    </div>
  );
}

export default App;
