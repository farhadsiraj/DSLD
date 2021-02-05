import React from 'react'
import Routes from '../routes'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyles from '../GlobalStyles'
import firebase from '../../firebase'
import NavBar from './NavBar'
import gym from '../../public/assets/images/gym.jpg'
const db = firebase.firestore()

const GradientContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  &:after {
    background: rgb(242, 102, 39);
    background: linear-gradient(
      -190deg,
      rgba(242, 102, 39, 1) 0%,
      rgba(255, 255, 255, 1) 75%,
      rgba(255, 255, 255, 1) 100%
    );
    content: ' ';
    display: block;
    position: absolute;
    top: -20px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 65px;
  z-index: 1;
`
// const Header = styled.div`
//   width: 80%;
//   height: 300px;
//   margin: 1rem;
//   border-radius: 10px;
//   background-image: url('../../public/assets/images/gym.jpg');
//   background-position: center;
//   z-index: 29;
// `

const Box = styled.div`
  width: 90%;
  height: 250px;
  background-color: #355c7d;
  margin: 1rem;
  border-radius: 2rem;
`

const MobileHeader = styled.img`
  margin-top: 1rem;
  width: 90%;
  height: 20%;
  border-radius: 2rem;
`

const InfoContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

export function Home() {
  return (
    <GradientContainer>
      <GlobalStyles />
      <NavBar />
      {window.location.pathname !== '/' ? (
        ''
      ) : (
        <ContentContainer>
          {/* <Header /> */}
          <MobileHeader src={gym} title="gym" />
          <InfoContainer>
            <Box>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  height: '100%',
                  color: 'white',
                }}
              >
                <div>Hipster Ipsum</div>
              </div>
            </Box>

            <Box />
            <Box />
          </InfoContainer>
        </ContentContainer>
      )}

      <Routes></Routes>
    </GradientContainer>
  )
}
