import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Main extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <div>Hello Posenet</div>
  }
}

ReactDOM.render(<Main />, document.getElementById('app'))
