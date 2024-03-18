import React, { useEffect, useState, Children } from "react"
import { Container, Button, Form } from "react-bootstrap"
import axios from "axios"
import Optimizer from "./Optimizer"

const MY_PLAYLISTS_ENDPOINT: string = "https://api.spotify.com/v1/me/playlists/"
const PLAYLIST_ENDPOINT: string = "https://api.spotify.com/v1/playlists/"

//Query function, search through playlists, or display playlists
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

    // Search for accessToken whenever locally stored accessToken is changed
    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            setToken(localStorage.getItem('accessToken'))
        }
    }, [localStorage.getItem('accessToken')])

    // Whenever accessToken is changed, grab user playlists
    useEffect(() => {
        axios.get(MY_PLAYLISTS_ENDPOINT, {
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

    
    
//Pass playlists, pass into query
    const [search, setSearch] = useState<string>("")
    const [songs, setSongs] = useState<any>([])
    const [allSongs, setAllSongs] = useState<JSX.Element[]>([])
    const [allSongIDs, setAllSongsIDs] = useState<string[]>([])

    // Playlist was clicked, grabbing tracks
    const handleGetTracks = (playlistName:string, playlistID: string) => {
        axios.get(PLAYLIST_ENDPOINT + playlistID + '/tracks?limit=100', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setSongs(response.data)

        })
        .catch((error: Error) => {
            console.log(error)
        })
        setPlaylistName(playlistName)
    }

    // Since songs were updated, spit out all songs as a div
    useEffect(() => {
        const repeats = new Set()
        const allIDs:string[] = []
        setAllSongs(songs?.items ? songs.items.map((item:any) => {
            if (item.track != null && !repeats.has(item.track.id)){
                repeats.add(item.track.id)
                allIDs.push(item.track.id)
                return (
                <div key={item.track.id}>
                    {item.track.name}
                </div>
                )
            } else { return (null)
            }}): null
        )
        setAllSongsIDs(allIDs)
    }, [songs])



//Run search function during render, so it loads for the user, calls on getSearchedItems for playlists data
    var searchResults:JSX.Element[] = []
    const allPlaylists = data?.items ? data.items.map((item:any) => (
        <div key={item.name} onClick={() => handleGetTracks(item.name, item.id)}>
            {item.name}
        </div>)) : null
        searchResults = getSearchedItems(search, allPlaylists)



//Call to Optimizer
    interface Prop {
        [key: string]: JSX.Element[]
    }
    const AUDIO_ANALYSIS_ENDPOINT: string = "https://api.spotify.com/v1/audio-analysis/"
    const [dataIDPair, setDataIDPair] = useState<Prop[]>([])
    const [songRequest, setSongRequest] = useState<string[]>([])
    const [songData, setSongData] = useState<any>([])
    const handleSongData = (key: string) => {
        return axios.get(AUDIO_ANALYSIS_ENDPOINT + key, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        // This grabs the audio analysis' first and last couple segments, from which it has a confidence array of keys ranging from
        // [C, C#, D, D#, E, F, F#, G, G#, A, A# and B] respectively
        // confidence goes from 0 - 1, with 1 being full confidence
        .then(response =>  {
            const first = response.data.segments.slice(0,1).map((selection:any) => selection.pitches)
            const last = response.data.segments.slice(-1).map((selection:any) => selection.pitches)
            return  {start: first, end: last} 
        })
        .catch((error: Error) => {
            console.log(error)
            return null
        })
    }

    // Button press optimize current playlist songs for analysis
    const handleOptimization = () => {
        setSongRequest(Children.toArray(allSongs).map((songs:any) => {
            return songs.key.substring(2)
        }))
    }

    // After songRequest is updated, call handleSongData
    useEffect(() => {
        const promises = songRequest.map(item => handleSongData(item))
        Promise.all(promises)
        .then(results => {
            setSongData(results)
        }).catch((error: Error) => {
            console.log(error)
        })
    },[songRequest])

    // After songData is updated, call setDataIDPair to send data to Optimizer
    useEffect(() => {
        setDataIDPair(allSongIDs.map((id:string, index: number) => ({
            [id]: songData[index]
            })))
    },[songData])
    


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
            Songs in: {playlistName} (Limit 100)
        </div>
        <ul>
            {allSongs}
        </ul>
        <Button onClick={handleOptimization}>Optimize</Button>
        <ul>
            <Optimizer inputData = {dataIDPair} />
        </ul>
    </Container>
    </>
    )
}

export default PlaylistPicker;