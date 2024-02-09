import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import PlaylistPicker from './components/PlaylistPicker'

const LoginState:boolean = window.location.hash? true : false

function App() {
  return (
    <Container>
      <Container>
      <Login />
    </Container>
      <PlaylistPicker />
    </Container>
  );
}

export default App;
