import React, { useEffect }from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap'

// const CLIENT_SECRET: string = "7e2471b9ce414c059de6924743b544b5"
const CLIENT_ID: string = "b1da2f24d03c4e43b63c463dc233f5c9"
const SPOTIFY_BASE_URL: string = "https://accounts.spotify.com/authorize"
const REDIRECT_URI: string = "http://localhost:3000"
const SCOPES: string[]  = ["streaming", "user-read-email", "user-read-private", "user-library-read", "playlist-read-private","playlist-read-collaborative", "playlist-modify-private", "playlist-modify-public"]
const SPACE_DELIMITER: string = "%20"
const SCOPES_URL: string = SCOPES.join(SPACE_DELIMITER)

const getReturnedParamsFromSpotifyAuth: any = (hash:string) => {
  const stringAfterHashtag = hash.substring(1)
  const paramInURL = stringAfterHashtag.split("&")
  const paramSplit = paramInURL.reduce((accumulator: Record<string, string>, currValue: string) => {
    const [key, value] = currValue.split("=")
    accumulator[key]= value
    return accumulator
  }, {})
  return paramSplit
}

const Login: React.FC = () => {

  useEffect(() => {
    if (window.location.hash) {
      const {
        access_token, 
        expires_in, 
        token_type
      } = getReturnedParamsFromSpotifyAuth(window.location.hash)

      localStorage.clear()

      localStorage.setItem("accessToken", access_token)
      localStorage.setItem("tokenType", token_type)
      localStorage.setItem("expiresIn", expires_in)
    }
  })

  const handleLogin = () => { 
    (window as Window).location = `${SPOTIFY_BASE_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL}&response_type=token&show_dialog=true`
  }

  return (
          <Button onClick={handleLogin}>
            Login to Spotify
          </Button>
  );
}

export default Login