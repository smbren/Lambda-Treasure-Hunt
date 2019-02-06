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
        title: '',
        description: '',
        coordinates: '',
        players: [],
        items: [],
        exits: [],
        cooldown: undefined,
        errors: [],
        messages: []

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

  move = (e, direction) => {
    e.preventDefault();
  
    axios
      .post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`, 

      { "direction": direction },
      
      { headers: 
        { Authorization: "Token 421139965c881b1e9ffe024b6233b338a12760f4" }, 
      },

      )

      .then(response => {
        this.setState({roomInfo: response.data})
      })

      .catch(error => {
        console.error("Invalid move.", error);
      })
  }



  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <p>
            You are standing in room {this.state.roomInfo.room_id}.<br />
            Choose a direction to explore the next room.<br />
            Possible exits include: {this.state.roomInfo.exits}<br />
            {this.state.roomInfo.cooldown}
          </p>


          <button onClick={e => {this.move(e, "n");}}>Move North</button>
          <button onClick={e => {this.move(e, "e");}}>Move East</button>
          <button onClick={e => {this.move(e, "s");}}>Move South</button>
          <button onClick={e => {this.move(e, "w");}}>Move West</button>


        
        </header>
      </div>
    );

  }

}

export default App;
