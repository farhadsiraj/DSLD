import React from 'react';
import styled from 'styled-components';
import GlobalStyles from '../GlobalStyles';
import { Model } from '../Models/SquatModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

// const ContentContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   width: 70%;
//   margin-top: 65px;
//   z-index: 1;
//   @media only screen and (max-width: 1200px) {
//     width: 90%;
//   }
// `;
const TopToolbar = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  width: 100%;
`;

// const WorkoutType = styled.div`
//   display: flex;
//   justify-content: center;
//   padding: 1rem;
//   text-decoration: none;
//   color: white;
//   font-size: 1.4rem;
//   border-radius: 10px;
//   background-color: #355c7d;
//   border: 0px;
//   width: 10rem;
// `;

export default function FormCheck() {
  return (
    <GradientContainer>
      <GlobalStyles />
      <Container>
        {/* <ContentContainer> */}
        {/* <TopToolbar>
            <WorkoutType>Squat</WorkoutType>
            <WorkoutType id="timer">00:00</WorkoutType>
            <FontAwesomeIcon
              icon={faForward}
              style={{ fontSize: '2.5rem', color: '#355C7D' }}
            />
          </TopToolbar> */}
        <Model />
        {/* </ContentContainer> */}
      </Container>
    </GradientContainer>
  );
}
