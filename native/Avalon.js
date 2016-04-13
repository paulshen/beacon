const Role = {
  Follower: 'Follower',
  Minion: 'Minion',
};

const PlayerCountToRoles = {
  5: {
    [Role.Follower]: 3,
    [Role.Minion]: 2,
  },
  6: {
    [Role.Follower]: 4,
    [Role.Minion]: 2,
  },
  7: {
    [Role.Follower]: 4,
    [Role.Minion]: 3,
  },
  8: {
    [Role.Follower]: 5,
    [Role.Minion]: 3,
  },
  9: {
    [Role.Follower]: 6,
    [Role.Minion]: 3,
  },
  10: {
    [Role.Follower]: 6,
    [Role.Minion]: 4,
  },
};

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

export default class Avalon {
  constructor(gameState) {
    this.gameState = gameState;
  }

  start() {
    this._assignRoles();
    this._assignFirstLeader();
  }

  _assignRoles() {
    let playerKeys = Object.keys(this.gameState.model.players);
    shuffle(playerKeys);
    let roleCounts = PlayerCountToRoles[playerKeys.length];
    let roles = {};
    let i = 0;
    for (let role in roleCounts) {
      let start = i;
      for (; i < start + roleCounts[role]; i++) {
        roles[playerKeys[i]] = role;
      }
    }

    this.gameState.setAvalonState('roles', roles);
  }

  _assignFirstLeader() {
    let playerKeys = Object.keys(this.gameState.model.players);
    let initialLeaderKey = playerKeys[Math.floor(Math.random() * playerKeys.length)];

    this.gameState.setAvalonState('initialLeaderKey', initialLeaderKey);
  }

  _getAvalonModel() {
    return this.gameState.model && this.gameState.model.avalon;
  }

  getRoles() {
    let model = this._getAvalonModel();
    return model && model.roles;
  }

  getInitialLeaderKey() {
    let model = this._getAvalonModel();
    return model && model.initialLeaderKey;
  }
}