import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 16px;
  }

  a, Link {
    color: #325D79;
    text-decoration: none;
  }

  .link-reset {
    color: #F26627;
    text-decoration: none;
  }

  .hover-reset:hover {
    color: #F26627;
    text-decoration: none;
    border-bottom: #F9A26C;
    border-bottom-width: 0px;
  }

  a:hover{
    color: #325D79;
    text-decoration: none;
    border-bottom: #F9A26C;
    border-bottom-style: solid;
    border-bottom-width: 3px;
  }

  p {
    margin: 0;
  }

  .lighter {
    font-weight: 300;
  }

  .lightest {
    font-weight: 200;
  }


  .bootstrap-form-container {
  }

  .bootstrap-form {
  color: white;
  background-color: #355c7d;
  border-radius: 2rem;

  }

  @media only screen and (max-width: 959px){
    .bootstrap-form-container {
      width: 90%;
      margin-top: 6rem;
    }

  }

@media only screen and (min-width: 500px){
  .bootstrap-form-container {
    display: flex;
    justify-content: center;
  }

  .bootstrap-form{
  width: 28rem;
  }
}

@media only screen and (min-width: 960px) {
  .bootstrap-form {
  margin-top: 6rem;

  padding-top: 2rem;
  padding-bottom: 4rem;
  padding-left: 4rem;
  padding-right: 4rem;
  }
}

`;

export default GlobalStyle;
