
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth-context";  

interface PlaylistImage {
  url: string;
  height: number;
}

interface Playlist {
  playlist: string;
  description: string;
  image: PlaylistImage[];
  uri: string;
}

interface PlaylistSearchResponse {
  playlists: {
    items: Playlist[];
  };
}

export const usePlaylistSearch = () => {
  const [playlistSearch, setPlaylistSearch] = useState('');
  const [playlistSearchResults, setPlaylistSearchResults] = useState<Playlist[]>([]);
  const [playlistSearchError, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!playlistSearch) return setPlaylistSearchResults([]);
    
    const fetchPlaylistSearchResults = async () => {
      try {
        const response = await fetch(`http://localhost:3000/music/playlist-search?search=${encodeURIComponent(playlistSearch)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.spotifyToken.access_token}`, // Include the token here
            'Content-Type': 'application/json', // Optional: Ensure JSON format
          },
          credentials: 'include', // If you need to send cookies or other credentials
        });
        // console.log(response);
        
  
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
  
        const data: PlaylistSearchResponse = await response.json();
        // console.log('this is the data',data);
        
        // console.log('Playlist search results:', data);
        
        setPlaylistSearchResults(
          data.playlists.items.map((playlist: any) => {
            

            return {
              playlist: playlist.name,
              description: playlist.description,
              uri: playlist.uri,
              image: playlist.images[0]?.url,
            };
          })
        );

      

        console.log('playlist search results inside usePlaylist',playlistSearchResults);
        
      } catch (playlistSearchError) {
        setError((playlistSearchError as Error).message);
      }
    };
  
    fetchPlaylistSearchResults();
  }, [playlistSearch, user.spotifyToken]);

  return { playlistSearch, setPlaylistSearch, playlistSearchResults, playlistSearchError };
};