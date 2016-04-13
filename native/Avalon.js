export const Stage = {
  Nominating: 1,
  Voting: 2,
  Questing: 3,
};

export const Role = {
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

const PlayerCountToQuestSizes = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5],
  9: [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
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
    let playerKeys = Object.keys(this.gameState.getPlayers());
    let initialLeaderKey = playerKeys[Math.floor(Math.random() * playerKeys.length)];

    this.gameState.setAvalonState('initialLeaderKey', initialLeaderKey);
  }

  _getPossiblyUndefinedAvalonModel() {
    return this.gameState.model && this.gameState.model.avalon;
  }

  _getAvalonModel() {
    if (!this.gameState.model || !this.gameState.model.avalon) {
      throw Error('expected avalon model set');
    }

    return this.gameState.model.avalon;
  }

  _isNominationPass(nomination) {
    let yesVotes = Object.keys(nomination.votes).filter((key) => nomination.votes[key]);
    return yesVotes.length > this.gameState.getNumPlayers() / 2;
  }

  _getCurrentQuest() {
    let model = this._getAvalonModel();
    let questIndex = 0;
    let currentQuest;
    if (model.quests) {
      let questKeys = Object.keys(model.quests);
      questKeys.sort();
      questIndex = questKeys.length - 1;
      let lastQuest = model.quests[questKeys[questIndex]];

      if (!lastQuest.actions || Object.keys(lastQuest.actions).length !== this.gameState.getNumPlayers()) {
        let nominationKeys = Object.keys(lastQuest.nominations);
        nominationKeys.sort();
        currentQuest = {
          nominations: nominationKeys.map((key) => lastQuest.nominations[key]),
          actions: lastQuest.actions || {},
        };
      } else {
        questIndex++;
      }
    }

    return Object.assign({
      index: questIndex,
      nominations: [],
      actions: {},
    }, currentQuest);
  }

  _getCurrentNomination() {
    let currentQuest = this._getCurrentQuest();
    let nominationIndex = 0;
    let currentNomination;
    if (currentQuest.nominations.length > 0) {
      nominationIndex = currentQuest.nominations.length - 1;
      let lastNomination = currentQuest.nominations[nominationIndex];

      if (!lastNomination.votes || Object.keys(lastNomination.votes).length !== this.gameState.getNumPlayers() ||
          this._isNominationPass(lastNomination)) {
        let nomineeKeys = Object.keys(lastNomination.nominees);
        currentNomination = {
          nominees: nomineeKeys.map((key) => lastNomination.nominees[key]),
          votes: lastNomination.votes || {},
        };
      } else {
        nominationIndex++;
      }
    }

    return Object.assign({
      index: nominationIndex,
      nominees: [],
      votes: {},
    }, currentNomination);
  }

  _getLeaderKey(questIndex, nominationIndex) {
    let numNominations = 0;

    let model = this._getAvalonModel();
    if (model.quests) {
      for (let i = 0; i < questIndex; i++) {
        let quest = model.quests[key];
        if (quest.nominations) {
          numNominations += Object.keys(quest.nominations).length;
        }
      }

      numNominations += nominationIndex;
    }

    let playerKeys = Object.keys(this.gameState.getPlayers());
    playerKeys.sort();
    let initialLeaderIndex = playerKeys.indexOf(this.getInitialLeaderKey());
    let currentLeaderIndex = (initialLeaderIndex + numNominations) % playerKeys.length;

    return playerKeys[currentLeaderIndex];
  }

  getRoles() {
    let model = this._getPossiblyUndefinedAvalonModel();
    return model && model.roles;
  }

  getInitialLeaderKey() {
    let model = this._getPossiblyUndefinedAvalonModel();
    return model && model.initialLeaderKey;
  }

  getRoleForPlayerKey(playerKey) {
    return this.getRoles()[playerKey];
  }

  getQuestSizes() {
    return PlayerCountToQuestSizes[Object.keys(this.gameState.model.players).length];
  }

  getState() {
    let currentQuest = this._getCurrentQuest();
    let currentNomination = this._getCurrentNomination();
    if (currentNomination.nominees.length < this.getQuestSizes()[currentQuest.index]) {
      return {
        stage: Stage.Nominating,
        leaderKey: this._getLeaderKey(),
        questIndex: currentQuest.index,
        nominationIndex: currentNomination.index,
        nominees: currentNomination.nominees,
      };
    } else if (Object.keys(currentNomination.votes).length < this.gameState.getNumPlayers()) {
      return {
        stage: Stage.Voting,
        leaderKey: this._getLeaderKey(),
        questIndex: currentQuest.index,
        nominationIndex: currentNomination.index,
        nominees: currentNomination.nominees,
        votes: currentNomination.votes,
      };
    } else if (this._isNominationPass(currentNomination)) {
      return {
        stage: Stage.Questing,
        leaderKey: this._getLeaderKey(),
        questIndex: currentQuest.index,
        nominationIndex: currentNomination.index,
        nominees: currentNomination.nominees,
        votes: currentNomination.votes,
        actions: currentQuest.actions,
      };
    } else {
      throw new Error('unexpected stage');
    }
  }

  nominate(playerKeys) {
    let avalonState = this.getState();
    let { leaderKey, questIndex, nominationIndex } = avalonState;
    if (this.gameState.getPlayerKey() === leaderKey) {
      this.gameState.setAvalonState(`quests/${questIndex}/nominations/${nominationIndex}/nominees`, playerKeys);
    } else {
      throw new Error('trying to nominate when not leader');
    }
  }
}
