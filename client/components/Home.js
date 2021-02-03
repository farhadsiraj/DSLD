import React from 'react'
import styled from 'styled-components'
import GlobalStyles from '../GlobalStyles'
import NavBar from './NavBar'

export default function Home() {
  return (
    <div>
      <GlobalStyles />
      <NavBar />
      <div>Home Page!</div>
    </div>
  )
}
