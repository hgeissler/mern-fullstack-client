import React, { Component } from 'react'
import './App.css'
import 'materialize-css'
import axios from 'axios'

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  }
  
  render () {
    const { data } = this.state
    return (
    <div>
      LETS GO
    </div>
    )
  };
}

export default App;
