import React, {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';
import { Stage, Team } from '../Avalon';
import GameStateView from './views/GameStateView';
import ActionPanel from './views/ActionPanel';
import RoleScreen from './RoleScreen';
import QuestResultScreen from './QuestResultScreen';
import VotingResultScreen from './VotingResultScreen';
import { KilgraveInfo } from './views/role_specific/KilgraveViews'
import { Button, Cells, Screen, UIText } from '../ui/Elements';
import Colors from '../ui/Colors';

const Modals = {
  VotingResult: '1',
  QuestResult: '2',
  Role: '3',
};
function _getIdForModal(modalType, questIndex, nominationIndex) {
  return `${modalType}/${questIndex}/${nominationIndex}`;
}
function _getModalDataFromId(modalId) {
  let [modalType, questIndex, nominationIndex] = modalId.split('/');
  return {
    modalType,
    questIndex: parseInt(questIndex, 10),
    nominationIndex: parseInt(nominationIndex, 10),
  };
}

const MediumTimerCheckpointSeconds = 180;
const HighTimerCheckpointSeconds = 240;

class Timer extends React.Component {
  componentDidMount() {
    this._interval = window.setInterval(this._onTick, 1000);
  }

  _onTick = () => {
    this.forceUpdate();
  };

  componentWillUnmount() {
    window.clearInterval(this._interval);
  }

  render() {
    let secondsElapsed = Math.floor((Date.now() - this.props.startTime) / 1000);
    let secondsString = `${secondsElapsed % 60}`;
    while (secondsString.length < 2) {
      secondsString = `0${secondsString}`;
    }
    let textStyle = null;
    if (secondsElapsed >= HighTimerCheckpointSeconds) {
      textStyle = styles.HighTimerText;
    } else if (secondsElapsed >= MediumTimerCheckpointSeconds) {
      textStyle = styles.MediumTimerText;
    }
    return (
      <UIText.Body style={textStyle}>
        {Math.floor(secondsElapsed / 60)}:{secondsString}
      </UIText.Body>
    );
  }
}

class MainScreen extends React.Component {
  state = {
    modalsSeen: [],
    modalIdToShow: null,
  };

  componentWillMount() {
    this._showModalIfNeeded();
  }

  componentWillUpdate() {
    this._showModalIfNeeded();
  }

  _showModalIfNeeded() {
    let avalonState = this.props.avalon.getState();
    let { stage, questIndex, nominationIndex } = avalonState;
    let modalId;
    switch (stage) {
    case Stage.Questing:
      modalId = _getIdForModal(Modals.VotingResult, questIndex, nominationIndex);
      break;
    case Stage.Nominating:
      if (nominationIndex > 0) {
        modalId = _getIdForModal(Modals.VotingResult, questIndex, nominationIndex - 1);
      } else if (questIndex > 0) {
        modalId = _getIdForModal(Modals.QuestResult, questIndex - 1, null);
      } else {
        modalId = _getIdForModal(Modals.Role, null, null);
      }
      break;
    case Stage.GameOver:
      modalId = _getIdForModal(Modals.QuestResult, questIndex - 1, null);
      break;
    }
    if (this.state.modalsSeen.indexOf(modalId) === -1) {
      this.setState({
        modalsSeen: [...this.state.modalsSeen, modalId],
        modalIdToShow: modalId,
      });
    }
  }

  _getIdForLastVoteModal() {
    let avalonState = this.props.avalon.getState();
    let { stage, questIndex, nominationIndex } = avalonState;
    nominationIndex = (stage === Stage.Questing) ? nominationIndex : nominationIndex - 1;
    return _getIdForModal(Modals.VotingResult, questIndex, nominationIndex);
  }

  _renderQuestInfo(avalonState) {
    if (avalonState.stage === Stage.GameOver) {
      return (
        <View style={styles.gameOverContainer}>
          <UIText.Title style={avalonState.winningTeam === Team.Good ? styles.GoodText : styles.EvilText}>
            {avalonState.winningTeam.toUpperCase()} TEAM WINS!
          </UIText.Title>
        </View>
      );
    }

    let timestamp;
    if (avalonState.stage === Stage.Nominating || avalonState.stage === Stage.Voting) {
      timestamp =
        <Cells.Item>
          <UIText.Title>TIME</UIText.Title>
          <Timer startTime={avalonState.startTime} />
        </Cells.Item>;
    }
    return (
      <View style={styles.questInfoContainer}>
        <Cells.Root>
          <Cells.Item>
            <UIText.Title>LEADER</UIText.Title>
            <UIText.Body>
              {this.props.gameState.getNameForPlayerKey(avalonState.leaderKey)}
            </UIText.Body>
          </Cells.Item>
          <Cells.Item>
            <UIText.Title>NOMINATION</UIText.Title>
            <UIText.Body>
              {avalonState.nominationIndex + 1} of 5
            </UIText.Body>
          </Cells.Item>
          {timestamp}
        </Cells.Root>
        <KilgraveInfo
          gameState={this.props.gameState}
          avalon={this.props.avalon}
          avalonState={avalonState}
          style={styles.kilgraveInfo}
        />
      </View>
    );
  }

  render() {
    let avalonState = this.props.avalon.getState();
    if (this.state.modalIdToShow) {
      let { modalType, questIndex, nominationIndex } = _getModalDataFromId(this.state.modalIdToShow);
      switch (modalType) {
      case Modals.VotingResult:
        return (
          <VotingResultScreen
            {...this.props}
            questIndex={questIndex}
            nominationIndex={nominationIndex}
            onDismiss={() => this.setState({modalIdToShow: null})}
          />
        );
      case Modals.QuestResult:
        return (
          <QuestResultScreen
            {...this.props}
            questIndex={questIndex}
            onDismiss={() => this.setState({modalIdToShow: null})}
          />
        );
      case Modals.Role:
        return <RoleScreen {...this.props} onDismiss={() => this.setState({modalIdToShow: null})} />;
      }
    }

    let lastVoteButton =
      <Button.Small
        onPress={() => this.setState({modalIdToShow: this._getIdForLastVoteModal()})}
        style={styles.lastVoteButton}>
        Last Vote
      </Button.Small>;

    return (
      <Screen style={styles.container}>
        <GameStateView
          avalon={this.props.avalon}
          showQuestResultModal={(questIndex) => this.setState({modalIdToShow: _getIdForModal(Modals.QuestResult, questIndex)})}
        />
        <Button.Small
          onPress={() => this.setState({modalIdToShow: _getIdForModal(Modals.Role)})}
          style={styles.roleButton}>
          {this.props.gameState.getPlayerName()}
        </Button.Small>
        {(avalonState.stage !== Stage.Questing && avalonState.nominationIndex === 0) ? null : lastVoteButton}
        <ScrollView style={styles.ScrollView}>
          <View style={styles.ScrollViewContents}>
            {this._renderQuestInfo(avalonState)}
            <ActionPanel gameState={this.props.gameState} avalon={this.props.avalon} avalonState={avalonState} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

MainScreen = withGameState(MainScreen);
export default MainScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  gameStateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questInfoContainer: {
    justifyContent: 'center',
  },
  gameOverContainer: {
    alignItems: 'center',
  },
  kilgraveInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    textAlign: 'center',
    marginBottom: 20,
  },
  roleButton: {
    left: 20,
    position: 'absolute',
    top: 30,
  },
  lastVoteButton: {
    right: 20,
    position: 'absolute',
    top: 30,
  },
  ScrollView: {
    flex: 1,
    paddingBottom: 30,
  },
  ScrollViewContents: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  GoodText: {
    color: Colors.Success,
  },
  EvilText: {
    color: Colors.Fail,
  },
  MediumTimerText: {
    color: Colors.Info,
  },
  HighTimerText: {
    color: Colors.Fail,
  },
});
