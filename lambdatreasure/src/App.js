import React, { Component } from 'react';

import axios from 'axios';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

      roomInfo: {
        room_id: '',
        coordinates: '',
        items: [],
        exits: [],
        cooldown: undefined,

      },
  
    };
  }


  componentDidMount() {
    axios

      .get("https://lambda-treasure-hunt.herokuapp.com/api/adv/init/", 

      { headers: 
        { Authorization: "Token 421139965c881b1e9ffe024b6233b338a12760f4" } 
      })

      .then(response => {
        this.setState(() => ({ roomInfo: response.data }));
      })

      .catch(error => {
        console.error("Error getting room info.", error);
      });

  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            You are standing in room {this.state.roomInfo.room_id}.<br />
            Choose a direction to explore the next room.<br />
            Possible exits include: {this.state.roomInfo.exits}
          </p>
        
        </header>
      </div>
    );

  }

}

export default App;
