import { useState } from 'react'
import './App.css'
import MainContent from "./MainContent"
import { Container } from '@mui/material'
function App() {
  return (
    <div id='mainDiv'>
      <Container maxWidth="xl">
        <MainContent/>
      </Container>
    </div>)
}

export default App
