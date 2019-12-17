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
    url: 'http://localhost:3001/api'
  }

  // fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see
  // if our db has changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb()
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 4000)
      this.setState({ intervalIsSet: interval })
    }
  }

  getDataFromDb = () => {
    fetch(this.state.url + '/getData')
    .then((data) => data.json())
    .then((res) => this.setState({ data: res.data }))
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet)
      this.setState({ intervalIsSet: null})
    }
  }

  // POSTMAN post:
  // headers: content-type: application/json
  // body: raw, JSON 
  // {
  // 	"id": 1233,
  // 	"message": "ASD"
  // }
  postDataToDB = (message) => {
    // console.log(message)
    let currentIds = this.state.data.map((data) => data.id)
    let idToBeAdded = 0
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded
    }
    axios.post(this.state.url +'/postData', {
      id: idToBeAdded,
      message: message,
    })
  }

  deleteFromDB = (idToDelete) => {
    parseInt(idToDelete)
    let objIdToDelete = null
    this.state.data.forEach(dat => {
      if (dat.id === idToDelete) {
        objIdToDelete = dat._id
      }
    })

    axios.delete(this.state.url + '/deleteData', {
      data: {
        id: objIdToDelete,
      }
    })
  }

  updateDB = (idToUpdate, updateMessage) => {
    let objIdToUpdate = null
    parseInt(idToUpdate)
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id
      }
    })

    axios.post(this.state.url + '/updateData', {
      id: objIdToUpdate,
      update: { message: updateMessage}
    })
  }

  render () {
    const { data } = this.state
    const messages = this.state.data.length === 0 ? <p> NO DATA </p> :
      this.state.data.map((dat, index) =>
        <li 
          className="collection-item" 
          key={ index }
        >
          <p style={{ margin: 0 }}>id: {dat.id} <br/>
          message: {dat.message}</p>
        </li>
      )

    return (
      <div>
        <ul className="collection">
          { messages }
        </ul>
        <br/>
        <div className="row">
          <div className="col s12">
            <div className="input-field inline">
              <input 
                type="text" className="validate"
                onChange={(e) => this.setState({ message: e.target.value})}
              />
              <label>add something to the DB</label>
            </div>
            
            <button 
              className="btn waves-effect waves-light" 
              type="submit" name="action"
              style={{ margin: 15 }}
              onClick={() => this.postDataToDB(this.state.message)}
            >
              Add
            </button>
          </div>
        </div>
        <br/>
      </div>
    )
  };
}

export default App;
