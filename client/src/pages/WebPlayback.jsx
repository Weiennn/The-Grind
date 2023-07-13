import { Box, Button, Divider, Typography } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from "@emotion/react";
import axios from 'axios';
import { APICall } from "../helper/APICall";
import { AuthContext } from "../helper/AuthContext";
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { useNavigate } from "react-router-dom";



function WebPlayback(props) {

    const track = {
        name: "",
        album: {
            images: [
                { url: "" }
            ]
        },
        artists: [
            { name: "" }
        ]
    };

    let navigate = useNavigate();
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    let theme = useTheme();
    const { authState } = useContext(AuthContext);
    const userId = authState.id;

    useEffect(() => {

        if (player) {
            return;
        }
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(props.token); },
            volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };

    }, []);

    const onResetPlayerClick = () => {
        axios.delete(`${APICall}/spotify/token/${userId}`);
        navigate("/spotify")
    };

    const onTogglePlayClick = () => {
        player.togglePlay();
    };

    const onNextClick = () => {
        player.nextTrack();
    };

    const onPreviousClick = () => {
        player.previousTrack();
    };

    if (!is_active) { 
        return (
                <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                >
                    <Box
                        sx={{
                        display: "flex",
                        width: "80%",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 4,
                        border: "5px solid",
                        borderColor: theme.palette.primary.main,
                        }}
                    >
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main}}>
                        Instance not active. Transfer your playback using your Spotify app.
                        </Typography>
                        <Divider sx={{ width: "100%", mb: 3 }} />
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="h6" component="div" sx={{ mb: 1,  }}>
                                Step 1: Open Spotify on your device.
                            </Typography>
                            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                                Step 2: Play a song.
                            </Typography>
                            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                                Step 3: Click on the device icon.
                            </Typography>
                            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                                Step 4: Select "Spotify Web SDK".
                            </Typography>
                            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                                Step 5: Enjoy!
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={onResetPlayerClick}
                            color="secondary"
                            sx={{ mt: 3 }}
                            >
                                Reset Player
                            </Button>
                    </Box>
                </Box>
                )
    } else {
        return (
                <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "5px solid",
                    padding: 4,
                    borderColor: theme.palette.primary.main,
                }}
                >
                    <Box
                        sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        }}
                    >
                        {
                            current_track.album.images[0].url !== null &&
                                <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
                        }
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 2, mt: 2, color: theme.palette.primary.main}}>
                            Now Playing: {current_track.name}
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main}}>
                            {current_track.artists[0].name}
                        </Typography>
                        <Divider sx={{ width: "100%", mb: 3 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', alignItems: 'center' }}>
                            <SkipPreviousIcon onClick={onPreviousClick} sx={{ color: theme.palette.primary.main, fontSize: 50, cursor: 'pointer' }} />
                            { is_paused ? <PlayCircleIcon onClick={onTogglePlayClick} sx={{ color: theme.palette.primary.main, fontSize: 50, cursor: 'pointer' }} /> : <PauseCircleIcon onClick={onTogglePlayClick} sx={{ color: theme.palette.primary.main, fontSize: 50, cursor: 'pointer' }} /> }
                            <SkipNextIcon onClick={onNextClick} sx={{ color: theme.palette.primary.main, fontSize: 50, cursor: 'pointer' }} />
                        </Box>
                    </Box>
                </Box>
  );
    }
}

export default WebPlayback