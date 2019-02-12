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

      },

      mapGraph: {

        0: {'n': '10', 's': '2', 'e': '4', 'w': '1'},
        10: {'n': '?', 's': '0', 'w': '?'},
        4: {'n': '?', 'e': '?', 'w': '0'},
        1: {'n': '?', 's': '?', 'e': '0', 'w': '?'},
        2: {'n': '0', 's': '?', 'e': '?'}, 

      },

      mapCoords: {

        0: [60,60],
        10: [60,61],
        4: [61,60],
        1: [59,60],
        2: [60,59],
    
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
      })

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
      })

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
      })

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
      })

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
      })

      .then(response => {
        this.setState({playerInfo: response.data})
      })

      .catch(error => {
        console.error("Couldn't sell item", error);
      })
  }



 buildGraph = (e) => {
    e.preventDefault();

    const cooldown = this.state.roomInfo.cooldown;
    const exits = this.state.roomInfo.exits;
    const current = this.state.roomInfo.room_id;


    //determine which room we are standing in
    //determine which exits are valid for this room
    //try an unexplored exit
    //log the new room coords and update the map with the new room
    //repeat
    let inverseDirection = {"n": "s", "s": "n", "w": "e", "e": "w"};
    let traversalPath = [];

    let bfs = (starting_node) => {

      let queue = [];
      let visited = [];

      queue.push(starting_node)

      while(queue.length > 0) {

        queue.shift();

        let path = queue;
        let v = path.slice(-1).pop();

        if ( !visited.includes(v) ) {

          visited.push(v);

          for(let exit in this.state.mapGraph[v]) {

            if(this.state.mapGraph[v][exit] == '?') {
              return path;
            }

          }

          for(let exitDirection in this.state.mapGraph[v]) {

            let newPath = [path];
            newPath.push(this.state.mapGraph[v][exitDirection]);
            queue.push(newPath);

          }

        } else {

          return null;

        }

      }

    }

    let getDirections = (path) => {

      let currentRoomExit = path[0]
      let directions = [];

      for(let room in path) {

        for(let exit in this.state.mapGraph[currentRoomExit]) {

          if(room == this.state.mapGraph[currentRoomExit][exit]) {

            directions.push(exit);

          }

        }

      }
      return directions;

    }

    while(true) {

      let currentRoomExits = this.state.mapGraph[this.room];
      let unexploredExits = [];

      for (let direction in currentRoomExits) {

        if(currentRoomExits[direction] == '?') {

          unexploredExits.push(direction);

        }

      }

      if(unexploredExits.length > 0) {

        let firstExit = unexploredExits[0];

        traversalPath.push(firstExit);

        let previousRoomID = this.room;
        //need to implement cooldown wait 
        this.move(firstExit);

        let exits = {};

        if(!(this.room in this.state.mapGraph)) {

          for(let exit in currentRoomExits) {

            exits[exit] = '?';

          }

          this.state.mapGraph[this.room] = exits;

        }

        this.state.mapGraph[previousRoomID][firstExit] = this.room;
        this.state.mapGraph[this.room][inverseDirection[firstExit]] = this.previousRoomID;

      } else {

        let backtrack = bfs(this.room);

        if(backtrack !== null) {
          
          for(let direction in getDirections(backtrack)) {

            traversalPath.push(direction);

            //need to implement cooldown timer 
            this.move(direction);

          }

        } else {

          break;

        }

      }

    }



  }
 

/* 
  traversal(mapGraph) {

    rooms = Object.keys(mapGraph).length;

    currentRoomExit = this.state.roomInfo.room_id;

    currentExits = mapGraph[currentRoomExit];

    unexploredExits = [];

    for (direction in currentExits) {

      if (currentExits[direction] == '?') {

        unexploredExits.push(direction);

      }

    }

    if (unexploredExits.length() > 0) {



      

    }
   

  }
 */

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <p>
            {this.state.playerInfo.name}<br />
            {this.state.playerInfo.cooldown}<br />
            {this.state.roomInfo.coordinates}<br />
            {this.state.playerInfo.inventory}

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
          <button onClick={e => {this.buildGraph(e);}}> Build Graph </button><br />

          <button onClick={e => {this.take(e);}}> Take Item </button><br />
          <button onClick={e => {this.sell(e);}}> Sell Item </button><br />
          <button onClick={e => {this.drop(e);}}> Drop Item </button><br />

        
        </header>
      </div>
    );

  }

}

export default App;
