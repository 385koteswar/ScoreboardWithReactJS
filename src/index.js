//to create a scorebord
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import "./styles.css";

var createReactClass = require("create-react-class");

var PLAYERS = [
  {
    name: "jimmy",
    score: 85,
    id: 1
  },
  {
    name: "sam ",
    score: 55,
    id: 2
  },
  {
    name: "rocky",
    score: 45,
    id: 3
  }
];
var nextId = 4;

var Stopwatch = createReactClass({
  getInitialState: function() {
    return {
      running: false,
      elapsedTime: 0,
      previousTime: 0
    };
  },
  componentDidMount: function() {
    this.interval = setInterval(this.onTick, 100);
  },

  componentWillMount: function() {
    clearInterval(this.interval);
  },
  onTick: function() {
    if (this.state.running) {
      var now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime)
      });
    }
    console.log("onTick");
  },

  onStart: function() {
    this.setState({
      running: true,
      previousTime: Date.now()
    });
  },

  onStop: function() {
    this.setState({
      running: false
    });
  },

  onReset: function() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now()
    });
  },

  render: function() {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    /*    var startStop = this.state.running ? (
      <button>Stop</button>
    ) : (
      <button>Start</button>
    );
  // THE ABOVE IS SIMILAR TO IF ELSE
  //the var can be replaced by the above code
    // if (this.state.running) {
    //   startStop = <button>Stop</button>;
    // } else {
    //   startStop = <button>Start</button>;
    // }
*/
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{seconds}</div>
        {this.state.running ? (
          <button onClick={this.onStop}>Stop</button>
        ) : (
          <button onClick={this.onStart}>Start</button>
        )}
        <button onClick={this.onReset}>Reset</button>
      </div>
    );
  }
});

var AddPlayerForm = createReactClass({
  propTypes: {
    onAdd: PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      name: ""
    };
  },
  onNameChange: function(e) {
    this.setState({ name: e.target.value });
  },
  onSubmit: function(e) {
    e.preventDefault();

    this.props.onAdd(this.state.name);
    this.setState({ name: " " });
  },

  render: function() {
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            value={this.state.name}
            onChange={this.onNameChange}
          />
          <input type="submit" value="add player" />
        </form>
      </div>
    );
  }
});

function Stats(props) {
  var totalPlayers = props.players.length;
  var totalpoints = props.players.reduce(function(total, player) {
    return total + player.score;
  }, 0);
  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points:</td>
          <td>{totalpoints}</td>
        </tr>
      </tbody>
    </table>
  );
}
Stats.proptypes = {
  players: PropTypes.array.isRequired
};

function Header(props) {
  return (
    <div className="header">
      <Stats players={props.players} />
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  players: PropTypes.array.isRequired
};

function Counter(props) {
  return (
    <div className="counter">
      <button
        className="counter-action decrement"
        onClick={function() {
          props.onChange(-1);
        }}
      >
        {" "}
        -{" "}
      </button>
      <div className="counter-score">{props.score}</div>
      <button
        className="counter-action increment"
        onClick={function() {
          props.onChange(+1);
        }}
      >
        {" "}
        +{" "}
      </button>
    </div>
  );
}

Counter.propTypes = {
  score: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

function Player(props) {
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>
          {" "}
          X{" "}
        </a>
        {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={props.onScoreChange} />
      </div>
    </div>
  );
}

Player.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

var App = createReactClass({
  propTypes: {
    title: PropTypes.string.isRequired,
    initialPlayers: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired
      })
    ).isRequired
  },
  getDefaultProps: function() {
    return {
      title: "Scoreboard"
    };
  },

  getInitialState: function() {
    return {
      players: this.props.initialPlayers
    };
  },

  onScoreChange: function(index, delta) {
    this.state.players[index].score += delta;
    this.setState(state => {
      return this.state;
    });
  },

  onPlayerAdd: function(name) {
    this.state.players.push({
      name: name,
      score: 0,
      id: nextId
    });
    this.setState(state => {
      return this.state;
    });
    nextId += 1;
  },

  onRemove: function(index) {
    this.state.players.splice(index, 1);
    this.setState(state => {
      return this.state;
    });
  },

  render: function() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players} />
        <div className="players">
          {this.state.players.map(
            function(player, index) {
              return (
                <Player
                  onScoreChange={function(delta) {
                    this.onScoreChange(index, delta);
                  }.bind(this)}
                  onRemove={function() {
                    this.onRemove(index);
                  }.bind(this)}
                  name={player.name}
                  score={player.score}
                  key={player.id}
                />
              );
            }.bind(this)
          )}
        </div>
        <AddPlayerForm onAdd={this.onPlayerAdd} />
      </div>
    );
  }
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App initialPlayers={PLAYERS} />, rootElement);
