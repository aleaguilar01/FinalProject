import React, { useState, useEffect } from "react";
import TestPage from "./MediaPlayer";
import { useAuth } from "../../context/auth-context";
import { FrownOutlined } from "@ant-design/icons";

interface Playlist {
  id: string;   // or number, depending on your data
  name: string;
}

const MusicDashboard = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);


//// Getting Spotify Auth Token
const {user} = useAuth()
user.spotifyToken
// console.log('this is the spotify token', user.spotifyToken);


useEffect(() => {
  if (!user.spotifyToken.access_token) {
    setError('Spotify token is missing');
    return;
  }
  const fetchPlaylists = async () => {
    try {
      const response = await fetch('http://localhost:3000/music/playlists', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.spotifyToken.access_token}`, // Include the token here
          'Content-Type': 'application/json', // Optional: Ensure JSON format
        },
        credentials: 'include', // If you need to send cookies or other credentials
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Playlists");
      }
      const data = await response.json();
      // console.log('data from fetch playlists', data);
      
      setPlaylists(data.items);
      // console.log('playlists state', playlists);
      
    } catch (err) {
      setError(err.message);
    }
  };
  fetchPlaylists();
  
  
}, [user.spotifyToken.access_token]); // Add user.spotifyToken as a dependency
  
  return <>
  This is the Music Dashboard <br />
  BookBeat's Available Spotify Routes <br />
  {/* Change these urls to Link or useNavigate*/}
    <a href='http://localhost:3000/music/playlists'>Get User's Playlists</a> <br />
    <a href=''>Music Player N/A</a> <br />
    <a href=''>Reccomended Playlist N/A</a> <br />
    <a href=''>Your Playlists (for book) N/A</a> <br />
    <a href=''>Create Playlist N/A</a> <br />
    <a href=''>Adding Tracks to Playlist N/A</a>

  
  {/* <div>
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}> {playlist.id}</li>
      ))}
    </ul>
  </div> */}
   <TestPage></TestPage>

  </>
}

export default MusicDashboard;





