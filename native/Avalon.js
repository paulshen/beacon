export const Stage = {
  Nominating: 1,
  Voting: 2,
  Questing: 3,
};

export const Team = {
  Good: 'Good',
  Evil: 'Evil',
};

export const Role = {
  Follower: 'Follower',
  Merlin: 'Merlin',
  Percival: 'Percival',
  Sherlock: 'Sherlock',
  Minion: 'Minion',
  Assassin: 'Assassin',
  Morgana: 'Morgana',
  Mordred: 'Mordred',
  Oberon: 'Oberon',
  Kilgrave: 'Kilgrave',
};

const TeamToBasicRole = {
  [Team.Good]: Role.Follower,
  [Team.Evil]: Role.Minion,
};

const RoleToTeam = {
  [Role.Follower]: Team.Good,
  [Role.Merlin]: Team.Good,
  [Role.Percival]: Team.Good,
  [Role.Sherlock]: Team.Good,
  [Role.Minion]: Team.Evil,
  [Role.Assassin]: Team.Evil,
  [Role.Morgana]: Team.Evil,
  [Role.Mordred]: Team.Evil,
  [Role.Oberon]: Team.Evil,
  [Role.Kilgrave]: Team.Evil,
};

const RoleToKnownRoles = {
  [Role.Follower]: [],
  [Role.Merlin]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Oberon, Role.Kilgrave],
  [Role.Percival]: [Role.Merlin, Role.Morgana],
  [Role.Sherlock]: [],
  [Role.Minion]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Mordred, Role.Kilgrave],
  [Role.Assassin]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Mordred, Role.Kilgrave],
  [Role.Morgana]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Mordred, Role.Kilgrave],
  [Role.Mordred]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Mordred, Role.Kilgrave],
  [Role.Oberon]: [],
  [Role.Kilgrave]: [Role.Minion, Role.Assassin, Role.Morgana, Role.Mordred, Role.Kilgrave],
};

const PlayerCountToTeamSizes = {
  5: {
    [Team.Good]: 3,
    [Team.Evil]: 2,
  },
  6: {
    [Team.Good]: 4,
    [Team.Evil]: 2,
  },
  7: {
    [Team.Good]: 4,
    [Team.Evil]: 3,
  },
  8: {
    [Team.Good]: 5,
    [Team.Evil]: 3,
  },
  9: {
    [Team.Good]: 6,
    [Team.Evil]: 3,
  },
  10: {
    [Team.Good]: 6,
    [Team.Evil]: 4,
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
    this._assignFirstLeader();
  }

  _assignFirstLeader() {
    let playerKeys = Object.keys(this.gameState.getPlayers());
    let initialLeaderKey = playerKeys[Math.floor(Math.random() * playerKeys.length)];

    this.gameState.setAvalonState('initialLeaderKey', initialLeaderKey);
  }

  getSelectableRolesByTeam() {
    let teamSizes = PlayerCountToTeamSizes[this.gameState.getNumPlayers()];
    let selectableRolesByTeam = {};
    for (let team in teamSizes) {
      selectableRolesByTeam[team] = {
        maxCount: teamSizes[team],
        roles: [],
      };
    }
    for (let role in RoleToTeam) {
      let team = RoleToTeam[role];
      if (TeamToBasicRole[team] !== role) {
        selectableRolesByTeam[team].roles.push(role);
      }
    }
    return selectableRolesByTeam;
  }

  assignRoles(selectedRolesByTeam) {
    this._assignRoles(selectedRolesByTeam);
    this.gameState.setAvalonState('startTime', Firebase.ServerValue.TIMESTAMP);
  }

  _assignRoles(selectedRolesByTeam) {
    let playerKeys = Object.keys(this.gameState.model.players);
    shuffle(playerKeys);
    let teamSizes = PlayerCountToTeamSizes[playerKeys.length];

    let roles = {};
    let numRolesAssigned = 0;
    for (let team in selectedRolesByTeam) {
      let selectedRoles = selectedRolesByTeam[team];
      for (let i = 0; i < selectedRoles.length; i++) {
        roles[playerKeys[numRolesAssigned]] = selectedRoles[i];
        numRolesAssigned++;
        teamSizes[team]--;
      }
    }

    for (let team in teamSizes) {
      while (teamSizes[team] > 0) {
        roles[playerKeys[numRolesAssigned]] = TeamToBasicRole[team];
        numRolesAssigned++;
        teamSizes[team]--;
      }
    }

    if (numRolesAssigned !== playerKeys.length) {
      throw new Error('error assigning roles');
    }

    this.gameState.setAvalonState('roles', roles);
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
    let actionsFinished = (
      quest.actions &&
      Object.keys(quest.actions).length === this.getQuestSizes()[questIndex]
    );
    let kilgraveFinished = !this.isRoleInGame(Role.Kilgrave) || this.hasKilgraveChosen(questIndex + 1);
    if (actionsFinished && kilgraveFinished) {
      if (!this.isRoleInGame(Role.Sherlock)) {
        return true;
      }

      let nominees = quest.nominations[quest.nominations.length - 1].nominees;
      let roles = this.getRoles();
      for (let i = 0; i < nominees.length; i++) {
        if (roles[nominees[i]] === Role.Sherlock) {
          return true;
        }
      }

      if (quest.sherlockInspected) {
        return true;
      }
    }

    return false;
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
      questIndex = model.quests.length - 1;

      if (this._isQuestFinished(model.quests[questIndex], questIndex)) {
        questIndex++;
      }
    }

    return questIndex;
  }

  _getQuestByIndex(questIndex) {
    let model = this._getAvalonModel();
    let ret;
    if (model.quests && model.quests.length > questIndex) {
      let quest = model.quests[questIndex];
      ret = {
        nominations: quest.nominations || [],
        actions: quest.actions || {},
        sherlockInspected: quest.sherlockInspected,
      };
    }

    return Object.assign({
      index: questIndex,
      nominations: [],
      actions: {},
      sherlockInspected: null,
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
      ret = {
        nominees: nomination.nominees || [],
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
      for (let i = 0; i < questIndex; i++) {
        let quest = model.quests[i];
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

  isRoleInGame(role) {
    let roles = this.getRoles();
    for (let key in roles) {
      if (roles[key] === role) {
        return true;
      }
    }
    return false;
  }

  getRoleForPlayerKey(playerKey) {
    return this.getRoles()[playerKey];
  }

  isGood(playerKey) {
    return RoleToTeam[this.getRoleForPlayerKey(playerKey)] === Team.Good;
  }

  getKnownRolesForPlayerKey(playerKey) {
    return RoleToKnownRoles[this.getRoleForPlayerKey(playerKey)];
  }

  getQuestSizes() {
    return PlayerCountToQuestSizes[Object.keys(this.gameState.model.players).length];
  }

  getQuestOutcome(questIndex) {
    let quest = this._getQuestByIndex(questIndex);

    if (!this._isQuestFinished(quest, questIndex)) {
      return null;
    }

    let numFail = Object.keys(quest.actions).filter((key) => !quest.actions[key]).length;
    return {
      nominees: quest.nominations[quest.nominations.length - 1].nominees,
      numSuccess: Object.keys(quest.actions).filter((key) => quest.actions[key]).length,
      numFail: numFail,
      verdict: numFail === 0,
      sherlockInspected: quest.sherlockInspected,
      sherlockInspectedAction: quest.actions[quest.sherlockInspected],
    }
  }

  hasSherlockInspected(questIndex) {
    let quest = this._getQuestByIndex(questIndex);
    return !!quest.sherlockInspected;
  }

  hasKilgraveChosen(questIndex) {
    let model = this._getAvalonModel();
    return model.lastKilgraveAction &&
           (model.lastKilgraveAction.questIndex >= questIndex ||
            model.lastKilgraveAction.target);
  }

  getKilgraveTarget(questIndex) {
    let model = this._getAvalonModel();
    if (model.lastKilgraveAction &&
        model.lastKilgraveAction.questIndex === questIndex) {
      return model.lastKilgraveAction.target;
    }
    return null;
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

  sherlockInspect(questIndex, playerKey) {
    let avalonState = this.getState();
    let { questIndex: currentQuestIndex } = avalonState;
    if (questIndex === currentQuestIndex) {
      this.gameState.setAvalonState(`quests/${questIndex}/sherlockInspected/`, playerKey);
      this.gameState.setAvalonState(`quests/${questIndex}/actionTimes/sherlock`, Firebase.ServerValue.TIMESTAMP);
    } else {
      throw new Error('invalid inputs for sherlockInspect');
    }
  }

  kilgraveMindControl(questIndex, targetPlayerKey) {
    let avalonState = this.getState();
    let { questIndex: currentQuestIndex } = avalonState;
    if (questIndex === currentQuestIndex + 1) {
      this.gameState.setAvalonState(
        `lastKilgraveAction`,
        {
          questIndex: questIndex,
          target: targetPlayerKey,
        }
      );
      this.gameState.setAvalonState(`quests/${questIndex - 1}/actionTimes/kilgrave`, Firebase.ServerValue.TIMESTAMP);
    } else {
      throw new Error('invalid inputs for kilgraveMindControl');
    }
  }
}
