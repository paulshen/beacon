export const Stage = {
  Nominating: 1,
  Voting: 2,
  Questing: 3,
};

export const Team = {
  Good: 'Good',
  Bad: 'Bad',
};

export const Role = {
  Follower: 'Follower',
  Merlin: 'Merlin',
  Percival: 'Percival',
  Minion: 'Minion',
  Assassin: 'Assassin',
  Morgana: 'Morgana',
  Mordred: 'Mordred',
  Oberon: 'Oberon',
};

const RoleToTeam = {
  [Role.Follower]: Team.Good,
  [Role.Merlin]: Team.Good,
  [Role.Percival]: Team.Good,
  [Role.Minion]: Team.Bad,
  [Role.Assassin]: Team.Bad,
  [Role.Morgana]: Team.Bad,
  [Role.Mordred]: Team.Bad,
  [Role.Oberon]: Team.Bad,
};

const RoleToKnownRoles = {
  [Role.Follower]: [],
  [Role.Merlin]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Oberon],
  [Role.Percival]: [Role.Merlin, Role.Morgana],
  [Role.Minion]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Mordred],
  [Role.Assassin]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Mordred],
  [Role.Morgana]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Mordred],
  [Role.Mordred]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Mordred],
  [Role.Oberon]: [],
};

const PlayerCountToRoles = {
  5: {
    [Role.Follower]: 1,
    [Role.Merlin]: 1,
    [Role.Percival]: 1,
    [Role.Assassin]: 1,
    [Role.Morgana]: 1,
  },
  6: {
    [Role.Follower]: 2,
    [Role.Merlin]: 1,
    [Role.Percival]: 1,
    [Role.Assassin]: 1,
    [Role.Morgana]: 1,
  },
  7: {
    [Role.Follower]: 2,
    [Role.Merlin]: 1,
    [Role.Percival]: 1,
    [Role.Minion]: 1,
    [Role.Assassin]: 1,
    [Role.Morgana]: 1,
  },
  8: {
    [Role.Follower]: 3,
    [Role.Merlin]: 1,
    [Role.Percival]: 1,
    [Role.Assassin]: 1,
    [Role.Morgana]: 1,
    [Role.Mordred]: 1,
  },
  9: {
    [Role.Follower]: 4,
    [Role.Merlin]: 1,
    [Role.Percival]: 1,
    [Role.Assassin]: 1,
    [Role.Morgana]: 1,
    [Role.Mordred]: 1,
  },
  10: {
    [Role.Follower]: 4,
    [Role.Merlin]: 1,
    [Role.Percival]: 1,
    [Role.Assassin]: 1,
    [Role.Morgana]: 1,
    [Role.Mordred]: 1,
    [Role.Oberon]: 1,
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

function _getHighestValueOfFirebaseArray(map) {
  let maxValue = null;
  Object.keys(map).forEach(k => {
    if (!maxValue || map[k] > maxValue) {
      maxValue = map[k];
    }
  });
  return maxValue;
}

export default class Avalon {
  constructor(gameState) {
    this.gameState = gameState;
  }

  start() {
    this._assignRoles();
    this._assignFirstLeader();
    this.gameState.setAvalonState('startTime', Firebase.ServerValue.TIMESTAMP);
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

  _isQuestFinished(quest, questIndex) {
    return quest.actions && Object.keys(quest.actions).length === this.getQuestSizes()[questIndex];
  }

  _isNominationFinished(nomination) {
    return nomination.votes && Object.keys(nomination.votes).length === this.gameState.getNumPlayers();
  }

  isNominationPass(nomination) {
    let yesVotes = Object.keys(nomination.votes).filter((key) => nomination.votes[key]);
    return yesVotes.length > this.gameState.getNumPlayers() / 2;
  }

  _getCurrentQuestIndex() {
    let model = this._getAvalonModel();
    let questIndex = 0;
    if (model.quests) {
      let questKeys = Object.keys(model.quests);
      questKeys.sort();
      questIndex = questKeys.length - 1;
      let lastQuest = model.quests[questKeys[questIndex]];

      if (this._isQuestFinished(lastQuest, questIndex)) {
        questIndex++;
      }
    }

    return questIndex;
  }

  _getQuestByIndex(questIndex) {
    let model = this._getAvalonModel();
    let ret;
    if (model.quests && Object.keys(model.quests).length > questIndex) {
      let questKeys = Object.keys(model.quests);
      questKeys.sort();
      let quest = model.quests[questKeys[questIndex]];
      let nominationKeys = Object.keys(quest.nominations);
      nominationKeys.sort();
      ret = {
        nominations: nominationKeys.map((key) => quest.nominations[key]),
        actions: quest.actions || {},
      };
    }

    return Object.assign({
      index: questIndex,
      nominations: [],
      actions: {},
    }, ret);
  }

  _getCurrentQuest() {
    return this._getQuestByIndex(this._getCurrentQuestIndex());
  }

  _getCurrentNominationIndex() {
    let currentQuest = this._getCurrentQuest();
    let nominationIndex = 0;
    if (currentQuest.nominations.length > 0) {
      nominationIndex = currentQuest.nominations.length - 1;
      let lastNomination = currentQuest.nominations[nominationIndex];

      if (this._isNominationFinished(lastNomination) && !this.isNominationPass(lastNomination)) {
        nominationIndex++;
      }
    }

    return nominationIndex;
  }

  getNominationByIndex(questIndex, nominationIndex) {
    let quest = this._getQuestByIndex(questIndex);
    let ret;
    if (quest.nominations.length > nominationIndex) {
      let nomination = quest.nominations[nominationIndex];
      let nomineeKeys = Object.keys(nomination.nominees);
      ret = {
        nominees: nomineeKeys.map((key) => nomination.nominees[key]),
        votes: nomination.votes || {},
      };
    }

    return Object.assign({
      index: nominationIndex,
      nominees: [],
      votes: {},
    }, ret);
  }

  _getCurrentNomination() {
    return this.getNominationByIndex(this._getCurrentQuestIndex(), this._getCurrentNominationIndex());
  }

  _getLeaderKey(questIndex, nominationIndex) {
    let numNominations = 0;

    let model = this._getAvalonModel();
    if (model.quests) {
      let questKeys = Object.keys(model.quests);
      questKeys.sort();
      for (let i = 0; i < questIndex; i++) {
        let quest = model.quests[questKeys[i]];
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

  getKnownRolesForPlayerKey(playerKey) {
    return RoleToKnownRoles[this.getRoleForPlayerKey(playerKey)];
  }

  getQuestSizes() {
    return PlayerCountToQuestSizes[Object.keys(this.gameState.model.players).length];
  }

  getQuestOutcome(questIndex) {
    let quest = this._getQuestByIndex(questIndex);

    if (Object.keys(quest.actions).length < this.getQuestSizes()[questIndex]) {
      return null;
    }

    let numFail = Object.keys(quest.actions).filter((key) => !quest.actions[key]).length;
    return {
      nominees: quest.nominations[quest.nominations.length - 1].nominees,
      numSuccess: Object.keys(quest.actions).filter((key) => quest.actions[key]).length,
      numFail: numFail,
      verdict: numFail === 0,
    }
  }

  _getNominationStageStartTime() {
    let currentQuest = this._getCurrentQuest();
    let questIndex = currentQuest.index;
    let currentNomination = this._getCurrentNomination();
    let nominationIndex = currentNomination.index;
    let model = this._getAvalonModel();
    if (nominationIndex > 0) {
      let lastNomination = model.quests[`${currentQuest.index}`].nominations[`${nominationIndex-1}`];
      return _getHighestValueOfFirebaseArray(lastNomination.voteTimes);
    } else if (questIndex > 0) {
      let previousQuest = model.quests[`${currentQuest.index-1}`];
      return _getHighestValueOfFirebaseArray(previousQuest.actionTimes);
    } else {
      return model.startTime;
    }
  }

  getState() {
    let currentQuest = this._getCurrentQuest();
    let questIndex = currentQuest.index;
    let currentNomination = this._getCurrentNomination();
    let nominationIndex = currentNomination.index;
    if (currentNomination.nominees.length < this.getQuestSizes()[questIndex]) {
      return {
        stage: Stage.Nominating,
        leaderKey: this._getLeaderKey(questIndex, nominationIndex),
        questIndex: questIndex,
        nominationIndex: nominationIndex,
        nominees: currentNomination.nominees,
        startTime: this._getNominationStageStartTime(),
      };
    } else if (Object.keys(currentNomination.votes).length < this.gameState.getNumPlayers()) {
      return {
        stage: Stage.Voting,
        leaderKey: this._getLeaderKey(questIndex, nominationIndex),
        questIndex: questIndex,
        nominationIndex: nominationIndex,
        nominees: currentNomination.nominees,
        votes: currentNomination.votes,
      };
    } else if (this.isNominationPass(currentNomination)) {
      return {
        stage: Stage.Questing,
        leaderKey: this._getLeaderKey(questIndex, nominationIndex),
        questIndex: questIndex,
        nominationIndex: nominationIndex,
        nominees: currentNomination.nominees,
        votes: currentNomination.votes,
        actions: currentQuest.actions,
      };
    } else {
      throw new Error('unexpected stage');
    }
  }

  nominate(questIndex, nominationIndex, nomineeKeys) {
    let avalonState = this.getState();
    let { leaderKey, questIndex: currentQuestIndex, nominationIndex: currentNominationIndex } = avalonState;
    if (this.gameState.getPlayerKey() === leaderKey &&
        questIndex === currentQuestIndex &&
        nominationIndex === currentNominationIndex) {
      this.gameState.setAvalonState(`quests/${questIndex}/nominations/${nominationIndex}/nominees`, nomineeKeys);
      this.gameState.setAvalonState(`quests/${questIndex}/nominations/${nominationIndex}/nominate/${this.gameState.getPlayerKey()}`, Firebase.ServerValue.TIMESTAMP);
    } else {
      throw new Error('invalid inputs for nominate');
    }
  }

  vote(questIndex, nominationIndex, approve) {
    let avalonState = this.getState();
    let { questIndex: currentQuestIndex, nominationIndex: currentNominationIndex } = avalonState;
    if (questIndex === currentQuestIndex &&
        nominationIndex === currentNominationIndex) {
      this.gameState.setAvalonState(`quests/${questIndex}/nominations/${nominationIndex}/votes/${this.gameState.getPlayerKey()}`, approve);
      this.gameState.setAvalonState(`quests/${questIndex}/nominations/${nominationIndex}/voteTimes/${this.gameState.getPlayerKey()}`, Firebase.ServerValue.TIMESTAMP);
    } else {
      throw new Error('invalid inputs for vote');
    }
  }

  questAction(questIndex, success) {
    let avalonState = this.getState();
    let { questIndex: currentQuestIndex } = avalonState;
    if (questIndex === currentQuestIndex) {
      this.gameState.setAvalonState(`quests/${questIndex}/actions/${this.gameState.getPlayerKey()}`, success);
      this.gameState.setAvalonState(`quests/${questIndex}/actionTimes/${this.gameState.getPlayerKey()}`, Firebase.ServerValue.TIMESTAMP);
    } else {
      throw new Error('invalid inputs for questAction');
    }
  }
}
