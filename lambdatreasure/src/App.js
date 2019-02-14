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
/* 
    let map = JSON.parse(localStorage.getItem('graph'))
    let roomID = JSON.parse(localStorage.getItem('roomID'))
    let exits = JSON.parse(localStorage.getItem('exits'))
    let coords = JSON.parse(localStorage.getItem('coords'))

    let exitList = {}

    if (!(roomID in map)) {

      exits.forEach(function(exit){

        exitList[exit] = '?'

      });

      map[roomID] = exitList

    }

    localStorage.setItem('graph', JSON.stringify(map)) */
  
    axios
      .post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`, 

      { "direction": direction },
      
      { headers: 
        { Authorization: "Token 421139965c881b1e9ffe024b6233b338a12760f4" }, 
      })

      .then(response => {
        localStorage.setItem('roomID', JSON.stringify(response.data.room_id))
        localStorage.setItem('coords', JSON.stringify(response.data.coordinates))
        localStorage.setItem('exits', JSON.stringify(response.data.exits))
        localStorage.setItem('cooldown', JSON.stringify(response.data.cooldown))
        this.setState({roomInfo: response.data})
      })
  
      .catch(error => {
        console.error("Invalid move.", error);
      })
  }

  autoRoam = (e) => {
    e.preventDefault();
    let inverseDirection = {"n": "s", "s": "n", "w": "e", "e": "w"};

    let currentRoomExits = this.state.roomInfo.exits;
    let index = Math.floor(Math.random() * currentRoomExits.length);

      while(true) {
        if(currentRoomExits.length > 1) {

          setInterval(this.move(e, currentRoomExits[index]), 10000);

        } else {

          setInterval(this.move(e, inverseDirection[currentRoomExits[0]]), 10000);

        }
      }

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
 
  bfs = (starting_node) => {

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

/*   getDirections = (path) => {

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

  }  */

  buildGraph = (e) => {
    e.preventDefault();

    let map = JSON.parse(localStorage.getItem('graph'))
    let currentRoom = this.state.roomInfo.room_id; 

   /*  let exits = this.state.roomInfo.exits;


    const cooldown = this.state.roomInfo.cooldown; */
    //let exits = this.state.roomInfo.exits;


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
        this.move(firstExit);

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
          //let directions = this.getDirections(backtrackPath)
          
          for(let direction in backtrackPath) {

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
          <img src={logo} className="App-logo" alt="logo" />

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

          <button onClick={e => {this.status(e);}}> Check status </button><br />
          <button onClick={e => {this.autoRoam(e);}}> Auto Roam </button><br />

          <button onClick={e => {this.take(e);}}> Take Item </button><br />
          <button onClick={e => {this.sell(e);}}> Sell Item </button><br />
          <button onClick={e => {this.drop(e);}}> Drop Item </button><br />

        
        </header>
      </div>
    );

  }

}

export default App;
