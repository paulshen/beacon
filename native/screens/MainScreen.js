import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';
import { Stage } from '../Avalon';
import ActionPanel from './views/ActionPanel';
import VotingResultScreen from './VotingResultScreen';

const Modals = {
  VotingResult: '1',
  QuestResult: '2',
};
function _getIdForModal(modalType, questIndex, nominationIndex) {
  return `${modalType}/${questIndex}/${nominationIndex}`;
}
function _getModalDataFromId(modalId) {
  let [modalType, questIndex, nominationIndex] = modalId.split('/');
  return { modalType, questIndex, nominationIndex };
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
    switch (stage) {
    case Stage.Questing:
      let modalId = _getIdForModal(Modals.VotingResult, questIndex, nominationIndex);
      if (this.state.modalsSeen.indexOf(modalId) === -1) {
        this.setState({
          modalsSeen: [...this.state.modalsSeen, modalId],
          modalIdToShow: modalId,
        });
      }
      break;
    case Stage.Nominating:
      if (nominationIndex > 0) {
        let modalId = _getIdForModal(Modals.VotingResult, questIndex, nominationIndex - 1);
        if (this.state.modalsSeen.indexOf(modalId) === -1) {
          this.setState({
            modalsSeen: [...this.state.modalsSeen, modalId],
            modalIdToShow: modalId,
          });
        }
      } else if (questIndex > 0) {
        let modalId = _getIdForModal(Modals.QuestResult, questIndex - 1, null);
        if (this.state.modalsSeen.indexOf(modalId) === -1) {
          this.setState({
            modalsSeen: [...this.state.modalsSeen, modalId],
            modalIdToShow: modalId,
          });
        }
      }
      break;
    }
  }

  _renderGameState(avalonState) {
    return (
      <View style={styles.gameStateContainer}>
        {this.props.avalon.getQuestSizes().map((questSize, questIndex) => {
          return (
            <Text key={questIndex} style={styles.label}>
              {questSize}
            </Text>
          );
        })}
      </View>
    );
  }

  _renderQuestInfo(avalonState) {
    return (
      <View style={styles.questInfoContainer}>
        <Text style={styles.label}>
          Current Quest
        </Text>
        <Text style={styles.label}>
          Leader: {this.props.gameState.getNameForPlayerKey(avalonState.leaderKey)}
        </Text>
        <Text style={styles.label}>
          Vote: {avalonState.nominationIndex + 1} of 5
        </Text>
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
            avalonState={avalonState}
            onDismiss={() => this.setState({modalIdToShow: null})}
          />
        );
      case Modals.QuestResult:
        // return (
        //   <QuestResultScreen
        //     {...this.props}
        //     questIndex={questIndex}
        //     nominationIndex={nominationIndex}
        //     avalonState={avalonState}
        //     onDismiss={() => this.setState({modalIdToShow: null})}
        //   />
        // );
      }
    }

    return (
      <View style={styles.container}>
        {this._renderGameState(avalonState)}
        {this._renderQuestInfo(avalonState)}
        <ActionPanel gameState={this.props.gameState} avalon={this.props.avalon} avalonState={avalonState} />
      </View>
    );
  }
}

MainScreen = withGameState(MainScreen);
export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  gameStateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
