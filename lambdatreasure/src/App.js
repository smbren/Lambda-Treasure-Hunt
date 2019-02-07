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

      playerInfo: {

        name: '',
        cooldown: undefined,
        encumbrance: undefined,  // How much are you carrying?
        strength: undefined,  // How much can you carry?
        speed: undefined,  // How fast do you travel?
        gold: undefined,
        inventory: [],
        status: [],
        errors: [],
        messages: []

      }
  
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

  status = (e) => {
    e.preventDefault();
  
    axios
      .post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/status/`, 
      
      { headers: 
        { Authorization: "Token 421139965c881b1e9ffe024b6233b338a12760f4" }, 
      },

      )

      .then(response => {
        this.setState({playerInfo: response.data})
      })

      .catch(error => {
        console.error("Error getting player data.", error);
      })
  }

  take = (e) => {
    e.preventDefault();
  
    axios
      .post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/take/`, 

      { "name": "Treasure" },
      
      { headers: 
        { Authorization: "Token 421139965c881b1e9ffe024b6233b338a12760f4" }, 
      },

      )

      .then(response => {
        this.setState({playerInfo: response.data})
      })

      .catch(error => {
        console.error("Couldn't take item", error);
      })
  }

  drop = (e) => {
    e.preventDefault();
  
    axios
      .post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/drop/`, 

      { "name": "treasure" },
      
      { headers: 
        { Authorization: "Token 421139965c881b1e9ffe024b6233b338a12760f4" }, 
      },

      )

      .then(response => {
        this.setState({playerInfo: response.data})
      })

      .catch(error => {
        console.error("Couldn't drop item.", error);
      })
  }

  sell = (e) => {
    e.preventDefault();
  
    axios
      .post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/`, 

      { "name": "treasure", "confirm": "yes" },
      
      { headers: 
        { Authorization: "Token 421139965c881b1e9ffe024b6233b338a12760f4" }, 
      },

      )

      .then(response => {
        this.setState({playerInfo: response.data})
      })

      .catch(error => {
        console.error("Couldn't sell item", error);
      })
  }

  autoRoam = (e) => {
    e.preventDefault();

    cooldown = this.state.roomInfo.cooldown;
    exits = this.state.roomInfo.exits;
    room = this.state.roomInfo.room_id;
    

    //determine which room we are standing in
    //determine which exits are valid for this room
    //try an unexplored exit
    //log the new room coords and update the map with the new room
    //repeat


  }




  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <p>
            {this.state.playerInfo.name}<br />
            {this.state.playerInfo.cooldown}<br />


            You are standing in room {this.state.roomInfo.room_id}.<br />
            Choose a direction to explore the next room.<br />
            {this.state.roomInfo.messages}<br />
            {this.state.roomInfo.title}<br />
            {this.state.roomInfo.items}<br />
            {this.state.roomInfo.description}<br />
            Possible exits: {this.state.roomInfo.exits}<br />
            You'll need to rest for {this.state.roomInfo.cooldown} second(s) before you have the strength to move again.<br />
          </p>


          <button onClick={e => {this.move(e, "n");}}>Move North</button>
          <button onClick={e => {this.move(e, "e");}}>Move East</button>
          <button onClick={e => {this.move(e, "s");}}>Move South</button>
          <button onClick={e => {this.move(e, "w");}}>Move West</button><br />

          <button onClick={e => {this.status(e);}}> Check status </button><br />

          <button onClick={e => {this.take(e);}}> Take Item </button><br />
          <button onClick={e => {this.sell(e);}}> Sell Item </button><br />
          <button onClick={e => {this.drop(e);}}> Drop Item </button><br />

        
        </header>
      </div>
    );

  }

}

export default App;
