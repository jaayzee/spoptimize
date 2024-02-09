import React, { useEffect, useState } from "react"
import { Container, Form } from "react-bootstrap"
import axios from "axios"

const PLAYLIST_ENDPOINT: string = "https://api.spotify.com/v1/me/playlists"

//Query function
const getSearchedItems = (search: string, playlists: JSX.Element[]) => {
    if (!search) {
        return playlists
    }
    return playlists.filter(playlists => {
        const propContent = playlists.props.children?.toString() || ''
        return propContent.includes(search)
    })
}

const PlaylistPicker = () => {
// Handle Playlists
    const [token, setToken] = useState<string | null>("")
    const [data, setData] = useState<any>({})
    const [playlistName, setPlaylistName] = useState<string>("")

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            setToken(localStorage.getItem('accessToken'))
        }
    }, [localStorage.getItem('accessToken')])

    useEffect(() => {
        axios.get(PLAYLIST_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setData(response.data)
        })
        .catch((error: Error) => {
            console.log(error)
        })
    },[token])
    
//Pass into query
    const [search, setSearch] = useState<string>("")
    const allPlaylists = data?.items ? data.items.map((item:any) => (
        <div key={item.name} onClick={() => handleGetTracks(item.name, item.href + '/tracks')} id={item.name}>
            {item.name}
        </div>)) : null
    const searchResults = getSearchedItems(search, allPlaylists)

// Get Playlist Tracks
    const[songs, setSongs] = useState<any>([])
    const handleGetTracks = (playlistName: string, playlistLink: string) => {
        axios.get(playlistLink, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setSongs(response.data)

        })
        .catch((error: Error) => {
            console.log(error)
        })
        setPlaylistName(playlistName != null ? playlistName : "")
    }

    const allSongs:JSX.Element[] = songs?.items ? songs.items.map((item:any) => (
    <div key={item.track.id}>
        {item.track.name}
    </div>)) : null
    
    return (
    <>
    <Container>
        <Form.Control
            type="search"
            placeholder="Search Your Playlist"
            onChange={e => setSearch(e.target.value)} 
        />
        <div className="flex-grow-1 my-2" style = {{ overflowY: "auto" }}>
            Playlists
        </div>
        <ul>
            {searchResults}
        </ul>
        <div className="flex-grow-1 my-2" style = {{ overflowY: "auto" }}>
            Songs in: {playlistName}
        </div>
        <ul>
            {allSongs}
        </ul>
    </Container>
    </>
    )
}

export default PlaylistPicker;