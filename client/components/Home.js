import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyles from '../GlobalStyles'
import firebase from '../../firebase'
import 'firebase/firestore'
import gym from '../../public/assets/images/gym.jpg'
import ball from '../../public/assets/images/ball.png'
import ohp from '../../public/assets/images/ohp.png'
import press from '../../public/assets/images/press.png'

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

const InfoContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

const MobileHeader = styled.img`
  margin-top: 1rem;
  width: 90%;
  height: 20%;
  border-radius: 2rem;
`

const HeaderBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 90%;
  height: 25vh;
  background-color: #355c7d;
  margin-top: 3vh;
  border-radius: 2rem;
`

const HeaderFlex = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  border-radius: 2rem;
  justify-content: center;
  align-items: center;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 250px;
  background-color: #355c7d;
  margin: 1rem;
  border-radius: 2rem;
  justify-content: center;
  align-items: center;
`

const HeaderTitle = styled.h1`
  margin-top: 0;
  font-size: 1.4rem;
  color: white;
  font-weight: 300;
`

const Text = styled.p`
  color: white;
  font-size: 0.7rem;
  width: 80%;
`

const Subtitle = styled.h2`
  color: white;
  font-size: 1rem;
  text-align: center;
  font-weight: 400;
  padding-top: 0.5rem;
`

const ImageBox = styled.img`
  width: 50%;
  height: auto;
  max-width: 100%;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10vh;
  background-color: #9bd7d1;
`

export function Home() {
  return (
    <GradientContainer>
      <GlobalStyles />
      <ContentContainer>
        <MobileHeader src={gym} title="DSLD keeps you fit" />
        <InfoContainer>
          <HeaderBox>
            <HeaderFlex>
              <HeaderTitle>Your Workout Companion.</HeaderTitle>
              <Text>
                DSLD (a.k.a Don't Skip Leg Day) keeps you honest by verifying
                completed reps to ensure you get the most out of your time in
                the gym.
              </Text>
            </HeaderFlex>
          </HeaderBox>
          <Box style={{ backgroundColor: '#F9A26C' }}>
            <ImageBox src={ball} />
            <Subtitle>Make Your Reps Count</Subtitle>
          </Box>
          <Box style={{ backgroundColor: '#9BD7D1' }}>
            <ImageBox src={ohp} />
            <Subtitle>Stay Accountable with Leaderboards</Subtitle>
          </Box>
          <Box style={{ backgroundColor: '#355c7d' }}>
            <ImageBox src={press} />
            <Subtitle>Unlock Skins</Subtitle>
          </Box>
        </InfoContainer>
        <Footer>
          <Link to="/signup" style={{ margin: '0.2rem' }}>
            Sign Up
          </Link>
          <Link to="/login" style={{ margin: '0.2rem' }}>
            Login
          </Link>
        </Footer>
      </ContentContainer>
    </GradientContainer>
  )
}
