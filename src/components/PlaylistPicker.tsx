import React, { useEffect, useState } from "react"
import axios from "axios"

const PLAYLIST_ENDPOINT: string = "https://api.spotify.com/v1/me/playlists"

const PlaylistPicker = () => {
    const [token, setToken] = useState<string | null>("")
    const [data, setData] = useState<any>({})

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            setToken(localStorage.getItem('accessToken'))
        }
    }, [])

        axios.get(PLAYLIST_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setData(response.data)
        })
        .catch((error: Error) => {
            console.log(error)
        })

    return (
    <>
        {data?.items ? data.items.map((item:any) => <div>{item.name}</div>) : null}
    </>
    )
}

export default PlaylistPicker;