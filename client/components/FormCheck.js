import React from 'react';
import styled from 'styled-components';
import GlobalStyles from '../GlobalStyles';
import NavBar from './NavBar';
import { Model } from '../Models/SquatModel';

const GradientContainer = styled.div`
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%; */

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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 65px;
  z-index: 1;
`;

export function FormCheck() {
  return (
    <GradientContainer>
      <GlobalStyles />
      <Container>
        <ContentContainer>
          <Model />
        </ContentContainer>
      </Container>
      {/* <div id="container">
        <video autoplay="true" id="videoElement"></video>
      </div> */}
    </GradientContainer>
  );
}

//media query look for screen width
// 375 x 812  = 2.16 h/w  .46
// 480 x 640  = 1.33 h/w
//
