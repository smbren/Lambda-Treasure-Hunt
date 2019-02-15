import React, { Component } from 'react';
import axios from 'axios';

import Graph from "react-graph-vis";

import './App.css';

const graph = {

  nodes: [
    { id: 0, label: "Room 0", color: "#41e0c9" },
    { id: 1, label: "Room 1", color: "#41e0c9" },
    { id: 2, label: "Room 2", color: "#41e0c9" },
    { id: 4, label: "Room 4", color: "#41e0c9" },
    { id: 10, label: "Room 10", color: "#41e0c9" },
    { id: 19, label: "Room 19", color: "#41e0c9" },
    { id: 43, label: "Room 43", color: "#41e0c9" },
    { id: 77, label: "Room 77", color: "#41e0c9" },
    { id: 20, label: "Room 20", color: "#41e0c9" },
    { id: 27, label: "Room 27", color: "#41e0c9" },
    { id: 63, label: "Room 63", color: "#41e0c9" },
    { id: 73, label: "Room 73", color: "#41e0c9" },
    { id: 72, label: "Room 72", color: "#41e0c9" },
    { id: 76, label: "Room 76", color: "#41e0c9" },
    { id: 47, label: "Room 47", color: "#41e0c9" },
    { id: 71, label: "Room 71", color: "#41e0c9" },
    { id: 46, label: "Room 46", color: "#41e0c9" },
    { id: 62, label: "Room 62", color: "#41e0c9" },
    { id: 84, label: "Room 84", color: "#41e0c9" },
    { id: 91, label: "Room 91", color: "#41e0c9" },
    { id: 99, label: "Room 99", color: "#41e0c9" },
    { id: 146, label: "Room 146", color: "#41e0c9" },
    { id: 257, label: "Room 257", color: "#41e0c9" },
    { id: 320, label: "Room 320", color: "#41e0c9" },
    { id: 348, label: "Room 348", color: "#41e0c9" },
    { id: 364, label: "Room 364", color: "#41e0c9" },
    { id: 448, label: "Room 448", color: "#41e0c9" },
    { id: 429, label: "Room 429", color: "#41e0c9" },
    { id: 381, label: "Room 381", color: "#41e0c9" },
    { id: 394, label: "Room 394", color: "#41e0c9" },
    { id: 190, label: "Room 190", color: "#41e0c9" },
    { id: 101, label: "Room 101", color: "#41e0c9" },
    { id: 64, label: "Room 64", color: "#41e0c9" },

  ],

  edges: [
    { from: 0, to: 10 }, 
    { from: 0, to: 1 }, 
    { from: 0, to: 4 }, 
    { from: 0, to: 2 },
    { from: 43, to: 10 },
    { from: 10, to: 19 },
    { from: 10, to: 77 },
    { from: 19, to: 20 },
    { from: 20, to: 27 },
    { from: 27, to: 63 },
    { from: 63, to: 73 },
    { from: 73, to: 72 },
    { from: 72, to: 76 },
    { from: 43, to: 47 },
    { from: 47, to: 71 },
    { from: 20, to: 46 },
    { from: 46, to: 62 },
    { from: 62, to: 84 },
    { from: 84, to: 91 },
    { from: 91, to: 99 },
    { from: 99, to: 146 },
    { from: 146, to: 257 },
    { from: 257, to: 320 },
    { from: 320, to: 348 },
    { from: 257, to: 364 },
    { from: 364, to: 448 },
    { from: 448, to: 429 },
    { from: 429, to: 381 },
    { from: 381, to: 394 },
    { from: 99, to: 190 },
    { from: 91, to: 101 },
    { from: 62, to: 64 },

  ]

};

const options = {
  layout: {
    hierarchical: true
  },
  edges: {
    color: "#000000"
  }
};

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

        0: {'n': '?', 'e': '?', 's': '?', 'w': '?'}

      },

      graph: {'n': '?', 'e': '?', 's': '?', 'w': '?'},

      mapCoords: {

        0: "(60,60)",

      },

    };
  }

/*   {"room_id": 13, "title": "A misty room", "description": "You are standing on grass and surrounded by a dense mist. You can barely make out the exits in any direction.", 
  "coordinates": "(62,60)", "elevation": 0, "terrain": "NORMAL", "players": [], "items": [], "exits": ["e", "w"], 
  "cooldown": 9.0, "errors": ["You cannot move that way: +5s CD"], "messages": []} */

  componentDidMount() {
    axios
      .get("https://lambda-treasure-hunt.herokuapp.com/api/adv/init/", 
      { headers: 
        { Authorization: "Token 421139965c881b1e9ffe024b6233b338a12760f4" } 
      })
      .then(response => {
        localStorage.setItem('graph', JSON.stringify(this.state.mapGraph))
        localStorage.setItem('mapCoords', JSON.stringify(this.state.mapCoords))
        localStorage.setItem('roomID', JSON.stringify(response.data.room_id))
        localStorage.setItem('coords', JSON.stringify(response.data.coordinates))
        localStorage.setItem('exits', JSON.stringify(response.data.exits))
        localStorage.setItem('cooldown', JSON.stringify(response.data.cooldown))
        console.log(localStorage)
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

      .then(response => {

        let map = JSON.parse(localStorage.getItem('mapCoords'))
        let currentRoom = this.state.roomInfo.room_id
        let currentRoomCoords = this.state.roomInfo.coordinates
        console.log(localStorage)
    
        if(!(currentRoom in map)) {
          map[currentRoom] = currentRoomCoords
          localStorage.setItem('mapCoords', JSON.stringify(map))
        }
      })

      .catch(error => {
        console.error("Invalid move.", error);
      })
  }

/*   autoRoam = (e) => {
    e.preventDefault();
    let inverseDirection = {"n": "s", "s": "n", "w": "e", "e": "w"};

    let currentRoomExits = this.state.roomInfo.exits;
    let index = Math.floor(Math.random() * currentRoomExits.length);

      while(true) {
        if(currentRoomExits.length > 1) {
          setInterval(this.move(e, currentRoomExits[index]), 10000);
        } else {
          setInterval(this.move(e, currentRoomExits[0]), 10000);
        }
      }
  } */

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
 
/*   bfs = (starting_node) => {

    let queue = [];
    let visited = [];
    queue.push([starting_node])

    while(queue.length > 0) {
      let path = queue.shift();
      let v = path.slice(-1).pop();

      if ( !(visited.includes(v)) ) {
        visited.push(v);

        for(let exit in this.state.mapGraph[v]) {

          if(this.state.mapGraph[v][exit] === '?') {
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

  getDirections = (path) => {

    let currentRoomExit = path[0]
    let directions = [];

    for(let room in path) {

      for(let exit in this.state.mapGraph[currentRoomExit]) {

        if(room === this.state.mapGraph[currentRoomExit][exit]) {

          directions.push(exit);

        }

      }

    }
    return directions;

  } 

  buildGraph = (e) => {
    e.preventDefault();

    let map = JSON.parse(localStorage.getItem('graph'))
    let currentRoom = this.state.roomInfo.room_id; 

   //  let exits = this.state.roomInfo.exits;
    //const cooldown = this.state.roomInfo.cooldown; 
    let exits = this.state.roomInfo.exits;
    //determine which room we are standing in
    //determine which exits are valid for this room
    //try an unexplored exit
    //log the new room coords and update the map with the new room
    //repeat
    let inverseDirection = {"n": "s", "s": "n", "w": "e", "e": "w"};
    let traversalPath = [];

    while(true) {
      let currentRoomExits = map[currentRoom];
      let unexploredExits = [];
      for (let direction in currentRoomExits) {
        if(currentRoomExits[direction] === '?') {
          unexploredExits.push(direction);
        }
      }

      if(unexploredExits.length > 0) {
        let firstExit = unexploredExits[0];
        traversalPath.push(firstExit);
        let previousRoomID = this.state.roomInfo.room_id;
        //need to implement cooldown wait 

        this.move(e, firstExit);

        let exits = {};
        if(!(currentRoom in map)) {
          for(let exit in currentRoomExits) {
            exits[exit] = '?';
          }
          map[currentRoom] = exits;
        }

        map[previousRoomID][firstExit] = currentRoom;
        map[currentRoom][inverseDirection[firstExit]] = previousRoomID;

      } else {

        let backtrackPath = this.bfs(currentRoom);

        if(backtrackPath !== null) {
          let directionsPath = this.getDirections(backtrackPath)  

          for(let direction in directionsPath) {
            traversalPath.push(direction);
            //need to implement cooldown timer 
            this.move(e, direction);
          }

        } else {
          break;
        }
      }
    }
  }
  

  getDirections = (path) => {
    let currentRoomExit = this.path[0]
    let directions = [];
    for(let room in path) {
      for(let exit in this.state.mapGraph[currentRoomExit]) {
        if(room === this.state.mapGraph[currentRoomExit][exit]) {
          directions.push(exit);
        }
      }
    }
    return directions;
  } 
 */
/* 
  traversal(mapGraph) {

    rooms = Object.keys(mapGraph).length;

    currentRoomExit = this.state.roomInfo.room_id;

    currentExits = mapGraph[currentRoomExit];

    unexploredExits = [];

    for (direction in currentExits) {

      if (currentExits[direction] === '?') {

        unexploredExits.push(direction);

      }

    }

    if (unexploredExits.length() > 0) {



      

    }
   

  }
 */

 //instructor example:
 /*  this.counter = this.counter.bind(this)

 sleep = (ms) => {
   return new Promise(resolve => setTimeout(resolve, ms))
 }

 async counter() {

  while(true) {

    localStorage.setItem('count', JSON.stringify(this.state.count))
    //traversal automation goes here
    await this.sleep(this.state.roomInfo.cooldown * 1000)

    this.setState({count: this.state.count + 1})

    if (this.state.count > 20) {
      break;
    }
    //break out of loop when all rooms have been explored

  }

 }

 const count = localStorage.getItem("count") */
 //instructor example


  render() {

    return (
      <div className="App">
        <header className="App-header">
        <Graph graph={graph} options={options} style={{ height: "600px" }} />

          <p>
            {this.state.playerInfo.name}<br />
            {this.state.playerInfo.cooldown}<br />
            {this.state.roomInfo.coordinates}<br />
            {this.state.playerInfo.inventory}
            You are standing in room {this.state.roomInfo.room_id}.<br />
            {this.state.roomInfo.messages}<br />
            {this.state.roomInfo.title}<br />
            {this.state.roomInfo.items}<br />
            Possible exits: {this.state.roomInfo.exits}<br />
            You'll need to rest for {this.state.roomInfo.cooldown} second(s) before you have the strength to move again.<br />
          </p>


          <button onClick={e => {this.move(e, "n");}}>Move North</button>
          <button onClick={e => {this.move(e, "e");}}>Move East</button>
          <button onClick={e => {this.move(e, "s");}}>Move South</button>
          <button onClick={e => {this.move(e, "w");}}>Move West</button><br />

          <button onClick={e => {this.autoRoam(e);}}> Auto Roam </button><br />

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
