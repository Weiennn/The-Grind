import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import { Route, Routes, Link } from "react-router-dom";
import Forum from "./Forum";
import NewPost from "./NewPost";
import Post from "./Post";
import Login from "./Login";
import Registration from "./Registration";
import Timer from "./Timer";
import StudyTimer from "./StudyTimer";
import RestTimer from "./RestTimer";
import Assignments from "./Assignments";
import NewAssignment from "./NewAssignment";
import Spotify from "./Spotify";
import { AuthContext } from "../helper/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToggleButton } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TimerIcon from "@mui/icons-material/Timer";
import ForumIcon from "@mui/icons-material/Forum";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  let navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    stay: false,
  });

  // Runs when the page is being refreshed or loaded
  useEffect(() => {
    // Check if there is a token
    let accessToken = localStorage.getItem("accessToken")
    // Check if there is a token
    if (!accessToken) {
      accessToken = sessionStorage.getItem("accessToken")
    } else {
      // No idea why this does not work
      /*const newAuth = { ...authState, stay: true }
      setAuthState(newAuth);*/
    }
    // Check if user has a valid token
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: accessToken,
        },
      })
      .then((response) => {
        if (response.data.error) {
          // Set login status to be false
          setAuthState({ ...authState, status: false, stay: false });
        } else {
          const check = localStorage.getItem("accessToken");
          let stay = false;
          if (check) {
            stay = true;
          }
          // Set login status to be true and set other user details
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            stay: stay,
          });
        }
      });
  }, []);

  // Function called when logging out
  const logout = () => {
    // Remove accessToken
    console.log(authState.stay);
    if (authState.stay) {
      localStorage.removeItem("accessToken");
    } else {
      sessionStorage.removeItem("accessToken");
    }
      setAuthState({
        username: "",
        id: 0,
        status: false,
        stay: false,
      });
      navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              size="small"
              aria-label="menu"
              color="inherit"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              edge="start"
              sx={{
                mr: 2,
                ...(open && { display: "none" }),
                justifyContent: "flex-start",
                display: "flex",
                width: "32px",
                height: "32px",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                justifyContent: "flex-start",
                display: "flex",
                flexBasis: "auto",
              }}
            >
              TimeTrekker
            </Typography>
            {!authState.status ? (
              <Button
                component={Link}
                size="large"
                variant="contained"
                color="secondary"
                to="/login"
              >
                Login
              </Button>
            ) : (
              <Button
                component={Link}
                size="large"
                variant="contained"
                color="secondary"
                onClick={logout}
              >
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Box width="55%">
              <Typography variant="h4">{authState.username}</Typography>
            </Box>
            <IconButton
              onClick={handleDrawerClose}
              sx={{
                width: "32px",
                height: "32px",
                color: theme.palette.primary.contrastText,
              }}
            >
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box>
              <ToggleButton
                fullWidth
                onClick={() => {
                  navigate(`/assignments`);
                }}
              >
                <Typography
                  variant="h6"
                  component="label"
                  sx={{ mr: 1, color: theme.palette.secondary.main }}
                >
                  Assignment
                </Typography>
                <AssignmentIcon color="secondary" />
              </ToggleButton>
            </Box>
            <Box>
              <ToggleButton
                fullWidth
                onClick={() => {
                  navigate(`/timer`);
                }}
              >
                <Typography
                  variant="h6"
                  component="label"
                  sx={{ mr: 1, color: theme.palette.secondary.main }}
                >
                  Pomodoro Timer
                </Typography>
                <TimerIcon color="secondary" />
              </ToggleButton>
            </Box>
            <Box>
              <ToggleButton
                fullWidth
                onClick={() => {
                  navigate(`/`);
                }}
              >
                <Typography
                  variant="h6"
                  component="label"
                  sx={{ mr: 1, color: theme.palette.secondary.main }}
                >
                  Forum
                </Typography>
                <ForumIcon color="secondary" />
              </ToggleButton>
            </Box>
            <Box sx={{ display: "flex" }}>
              <ToggleButton
                fullWidth
                onClick={() => {
                  navigate(`/newAssignment`);
                }}
              >
                <Typography
                  variant="h6"
                  component="label"
                  sx={{ mr: 1, color: theme.palette.secondary.main }}
                >
                  New Assignment
                </Typography>
                <AddIcon color="secondary" />
              </ToggleButton>
            </Box>
            <Box>
              <ToggleButton
                fullWidth
                onClick={() => {
                  navigate(`/newPost`);
                }}
              >
                <Typography
                  variant="h6"
                  component="label"
                  sx={{ mr: 1, color: theme.palette.secondary.main }}
                >
                  New Post
                </Typography>
                <CreateIcon color="secondary" />
              </ToggleButton>
            </Box>
            <Box>
              <ToggleButton
                fullWidth
                onClick={() => {
                  navigate(`/spotify`);
                }}
              >
                <Typography
                  variant="h6"
                  component="label"
                  sx={{ mr: 1, color: theme.palette.secondary.main }}
                >
                  spotify
                </Typography>
                <MusicNoteIcon color="secondary" />
              </ToggleButton>
            </Box>
          </Box>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Routes>
            <Route path="/" element={<Forum />} />
            <Route path="/newPost" element={<NewPost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/studyTimer" element={<StudyTimer />} />
            <Route path="/restTimer" element={<RestTimer />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/newAssignment" element={<NewAssignment />} />
            <Route path="/spotify" element={<Spotify />} />
          </Routes>
        </Main>
      </AuthContext.Provider>
    </Box>
  );
}
