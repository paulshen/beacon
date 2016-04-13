import React, {
  Component
} from 'react-native';
import Firebase from 'firebase';
import EventEmitter from 'eventemitter3';

import Avalon from './Avalon';

class GameState extends EventEmitter {
  constructor() {
    super();

    this.gameId = undefined;
    this.gameRef = undefined;
    this.playerKey = undefined;
    this.model = undefined;
    this.avalon = new Avalon(this);
  }

  init(gameId) {
    this.gameId = gameId;
    this.gameRef = new Firebase(`https://beacongame.firebaseio.com/games/${gameId}`);
    this.emit('change');

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

  getPlayerName() {
    if (!this.model || !this.model.players || !this.playerKey) {
      throw new Error('Called getPlayerName without data set', this);
    }
    return this.model.players[this.playerKey];
  }

  getAvalon() {
    return this.avalon;
  }

  setAvalonState(path, value) {
    this.gameRef.child('avalon').child(path).set(value);
  }
}

let _g = new GameState();

export function joinGame(gameId) {
  _g.init(gameId);
  return _g.await();
}

export function withGameState(ComposedComponent) {
  return class WithGameState extends Component {
    componentDidMount() {
      this._isMounted = true;
      _g.addListener('change', this._onChange);
    }

    componentWillUnmount() {
      this._isMounted = false;
      _g.removeListener('change', this._onChange);
    }

    _onChange = () => {
      if (this._isMounted) {
        this.forceUpdate();
      }
    };

    render() {
      return <ComposedComponent {...this.props} gameState={_g} avalon={_g.getAvalon()} />;
    }
  }
}
