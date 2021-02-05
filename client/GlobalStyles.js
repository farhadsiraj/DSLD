import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: Helvetica, sans-serif;
    font-size: 16px;
  }

  a {
    color: #325D79;
    text-decoration: none;
    border-bottom: #F9A26C;
    border-bottom-style: solid;
    border-bottom-width: 3px;
  }
`

export default GlobalStyle
