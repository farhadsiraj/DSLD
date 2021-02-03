import React from 'react'
import styled from 'styled-components'
import GlobalStyles from '../GlobalStyles'
import NavBar from './NavBar'

const Container = styled.div`
  margin-top: 65px;
  z-index: 0;
`
const Box = styled.div`
  width: 80%;
  height: 200px;
  background-color: #ccc;
`

export default function Home() {
  return (
    <Container>
      <GlobalStyles />
      <NavBar />
      <Box />
    </Container>
  )
}
