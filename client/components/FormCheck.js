import React from 'react';
import styled from 'styled-components';
import GlobalStyles from '../GlobalStyles';
import { Model } from '../Models/SquatModel';

export default function FormCheck() {
  return (
    <GradientContainer>
      <GlobalStyles />
      <Container>
        <Model />
      </Container>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TopToolbar = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  width: 100%;
`;
