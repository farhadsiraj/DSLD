import React, { Component } from 'react';
import styled from 'styled-components';
import GlobalStyles from '../GlobalStyles';

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 65px;
  z-index: 1;
`;

const LogInContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
`;

export function Login() {
  return (
    <ContentContainer>
      <GlobalStyles />
      <LogInContainer>
        <label>Username: </label>
        <input type="input" name="username"></input>
        <label>Password: </label>
        <input type="input" name="password"></input>
        <button type="submit">Login</button>
      </LogInContainer>
    </ContentContainer>
  );
}
