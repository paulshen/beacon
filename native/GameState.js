import React, {
  Component
} from 'react-native';
import Firebase from 'firebase';
import EventEmitter from 'EventEmitter';

import Avalon from './Avalon';

class GameState extends EventEmitter {
  constructor(gameId) {
    super();

    this.gameId = gameId;
    this.gameRef = new Firebase(`https://beacongame.firebaseio.com/games/${gameId}`);
    this.playerKey = null;
    this.model = undefined;
    this.avalon = new Avalon(this);

    this.gameRef.on('value', (snapshot) => {
      this.model = snapshot.val();
      this.emit('change');
    });
  }

  await() {
    if (this.model !== undefined) {
      return Promise.resolve(this);
    } else {
      return new Promise((resolve, reject) => {
        this.once('change', () => {
          resolve(this);
        });
      });
    }
  }

  setPlayer(name) {
    if (this.model && this.model.players) {
      for (let key in this.model.players) {
        if (this.model.players[key] === name) {
          this.playerKey = key;
          this.emit('change');
          return Promise.resolve(null);
        }
      }
    }

    return this.gameRef.child('players').push(name).then((playerRef) => {
      this.playerKey = playerRef.key();
      this.emit('change');
      return null;
    });
  }

  getPlayers() {
    return this.model && this.model.players;
  }

  getGameId() {
    return this.gameId;
  }

  getPlayerKey() {
    return this.playerKey;
  }

  getAvalon() {
    return this.avalon;
  }

  setAvalonState(path, value) {
    this.gameRef.child('avalon').child(path).set(value);
  }
}

let _g;
let _gResolve;
let _gPromise = new Promise((resolve, reject) => {
  _gResolve = resolve;
});

export function joinGame(gameId) {
  _g = new GameState(gameId);
  _gResolve(_g);
  return _g.await();
}

export function withGameState(ComposedComponent) {
  return class WithGameState extends Component {
    componentDidMount() {
      _gPromise.then((_g) => {
        _g.addListener('change', this._onChange);
      });
    }

    componentWillUnmount() {
      _gPromise.then((_g) => {
        _g.removeListener('change', this._onChange);
      });
    }

    _onChange = () => {
      this.forceUpdate();
    };

    render() {
      return <ComposedComponent {...this.props} gameState={_g} avalon={_g && _g.getAvalon()} />;
    }
  }
}