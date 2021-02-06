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

const ImageBox = styled.img`
  width: 45%;
  height: 70%;
  border-radius: 2rem;
  padding: 1rem;
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
          <Box>
            <ImageBox src={ball} />
            <Text style={{ textAlign: 'center' }}>Make Your Reps Count</Text>
          </Box>
          <Box>
            <ImageBox src={ohp} />
            <Text style={{ textAlign: 'center' }}>
              Stay Accountable with Leaderboards
            </Text>
          </Box>
          <Box>
            <ImageBox src={press} />
            <Text style={{ textAlign: 'center' }}>Unlock Skins</Text>
          </Box>
        </InfoContainer>
      </ContentContainer>
    </GradientContainer>
  )
}
