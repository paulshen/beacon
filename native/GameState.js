import React, {
  Component
} from 'react-native';
import Firebase from 'firebase';
import EventEmitter from 'EventEmitter';

class GameState extends EventEmitter {
  constructor(gameId) {
    super();

    this.gameId = gameId;
    this.gameRef = new Firebase(`https://beacongame.firebaseio.com/games/${gameId}`);
    this.value = {};

    this.gameRef.on('value', (snapshot) => {
      this.value = snapshot.val();
      this.emit('change');
    });
  }

  addPlayer(name) {
    return new Promise((resolve, reject) => {
      this.gameRef.child('players').push(name, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  }

  get() {
    return this.value;
  }
}

let _g;

export function joinGame(gameId) {
  _g = new GameState(gameId);
  return _g;
}

export function withGameState(ComposedComponent) {
  return class WithGameState extends Component {
    componentDidMount() {
      _g.addListener('change', this._onChange);
    }

    componentWillUnmount() {
      _g.removeListener('change', this._onChange);
    }

    _onChange = () => {
      this.forceUpdate();
    };

    render() {
      return <ComposedComponent {...this.props} gameState={_g} />;
    }
  }
}