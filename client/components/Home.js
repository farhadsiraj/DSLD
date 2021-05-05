import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import styled from 'styled-components';
import GlobalStyles from '../GlobalStyles';
import gym from '../../public/assets/images/gym.jpg';
import ball from '../../public/assets/images/ball.png';
import ohp from '../../public/assets/images/ohp.png';
import press from '../../public/assets/images/press.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <GradientContainer>
      <GlobalStyles />
      <ContentContainer>
        <MobileHeader src={gym} title="DSLD keeps you fit" />
        <InfoContainer>
          <HeaderContainer>
            <HeaderFlex>
              <HeaderBox>
                <NestedHeaderImage src={gym} />
              </HeaderBox>
              <HeaderBox>
                <HeaderTitle>Your Workout Companion.</HeaderTitle>
                <Text>
                  DSLD (a.k.a Don't Skip Leg Day) keeps you honest by verifying
                  completed reps to ensure you get the most out of your time in
                  the gym or at home.
                </Text>

                <Link
                  to={!currentUser ? '/signup' : '/dashboard'}
                  className="link-reset hover-reset"
                >
                  <StyledButton
                    style={{
                      backgroundColor: '#F9A26C',
                    }}
                  >
                    Get DSLD
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      style={{ marginLeft: '.7rem' }}
                    />
                  </StyledButton>
                </Link>
              </HeaderBox>
            </HeaderFlex>
          </HeaderContainer>
          <DetailsContainer>
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
          </DetailsContainer>
        </InfoContainer>
        {!currentUser ? (
          <Footer>
            <Link to="/signup" style={{ margin: '0.2rem' }}>
              Sign Up
            </Link>
            <Link to="/login" style={{ margin: '0.2rem' }}>
              Login
            </Link>
          </Footer>
        ) : (
          <Footer>
            <Text style={{ width: 'auto' }}>Copyright ©2021 DSLD</Text>
          </Footer>
        )}
      </ContentContainer>
    </GradientContainer>
  );
}

const GradientContainer = styled.div`
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
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 65px;
  z-index: 1;
`;

const InfoContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const MobileHeader = styled.img`
  margin-top: 1rem;
  width: 90%;
  height: 20%;
  border-radius: 2rem;
  @media only screen and (min-width: 960px) {
    display: none;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 90%;
  height: 25vh;
  background-color: #355c7d;
  margin-top: 3vh;
  border-radius: 2rem;
  @media only screen and (min-width: 960px) {
    height: 40vh;
  }
`;

const HeaderFlex = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  border-radius: 2rem;
  justify-content: center;
  align-items: center;
  @media only screen and (min-width: 960px) {
    flex-direction: row;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 100%;
  background-color: #355c7d;
  margin: 1rem;
  border-radius: 2rem;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const HeaderTitle = styled.h1`
  margin-top: 2rem;
  font-size: 1.4rem;
  color: white;
  font-weight: 800;
  @media only screen and (min-width: 960px) {
    font-size: 2.6rem;
    margin-top: 5rem;
  }
`;

const Text = styled.p`
  color: white;
  font-size: 0.7rem;
  margin-top: 0.5rem;
  width: 80%;
  font-weight: 400;
  @media only screen and (min-width: 960px) {
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

const Subtitle = styled.h2`
  color: white;
  font-size: 1rem;
  text-align: center;
  font-weight: 400;
  padding-top: 0.5rem;
`;

const ImageBox = styled.img`
  width: 50%;
  height: auto;
  max-width: 100%;
  padding: 1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10vh;
  background-color: #9bd7d1;
  @media only screen and (min-width: 960px) {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 7vh;
  }
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (min-width: 960px) {
    flex-direction: row;
    width: 92%;
  }
`;

const NestedHeaderImage = styled.img`
  display: none;
  @media only screen and (min-width: 960px) {
    display: flex;
    width: auto;
    height: auto;
    max-height: 100%;
    max-width: 90%;
    border-radius: 2rem;
  }
  @media only screen and (min-width: 1200px) {
    height: 90%;
  }
`;

const HeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  @media only screen and (min-width: 960px) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  @media only screen and (min-width: 1200px) {
    height: 90%;
  }
`;

const StyledButton = styled.button`
  background-color: #f67280;
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border-style: none;
  margin-bottom: 1.5rem;
  margin-top: 1.25rem;
  width: 100%;
  @media only screen and (min-width: 960px) {
    width: 10rem;
    margin-top: 4rem;
    padding: 1rem;
  }
`;
