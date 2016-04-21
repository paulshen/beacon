import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button, List, UIText } from '../../ui/Elements';

export default class NominatePane extends React.Component {
  state = {
    nomineeKeys: [],
  };

  _toggleNominee = (playerKey) => {
    let playerKeyIndex = this.state.nomineeKeys.indexOf(playerKey);
    if (playerKeyIndex !== -1) {
      this.state.nomineeKeys.splice(playerKeyIndex, 1);
      this.setState({
        nomineeKeys: this.state.nomineeKeys,
      });
    } else {
      this.setState({
        nomineeKeys: [...this.state.nomineeKeys, playerKey],
      });
    }
  };

  _didSelectCorrectNumber = () => {
    let questSize = this.props.avalon.getQuestSizes()[this.props.avalonState.questIndex];
    return this.state.nomineeKeys.length === questSize;
  };

  _onNominate = () => {
    if (this._didSelectCorrectNumber()) {
      this.props.avalon.nominate(
        this.props.avalonState.questIndex,
        this.props.avalonState.nominationIndex,
        this.state.nomineeKeys
      );
    } else {
      console.log('trying to nominate with incorrect number');
    }
  };

  render() {
    let { gameState, avalon, avalonState } = this.props;

    if (avalonState.leaderKey !== gameState.getPlayerKey()) {
      return <View><UIText.Body style={styles.WaitingText}>Waiting for nomination...</UIText.Body></View>;
    }

    let players = gameState.getPlayers();
    let playerRows = Object.keys(players).map((playerKey) => {
      return (
        <List.Item style={styles.row} key={playerKey}>
          <UIText.Body style={styles.rowName}>{gameState.getNameForPlayerKey(playerKey)}</UIText.Body>
          <TouchableOpacity onPress={() => this._toggleNominee(playerKey)}>
            <UIText.Body style={styles.rowName}>
              {this.state.nomineeKeys.indexOf(playerKey) !== -1 ? 'Unselect' : 'Select'}
            </UIText.Body>
          </TouchableOpacity>
        </List.Item>
      );
    });

    return (
      <View style={styles.root}>
        <UIText.Title style={styles.title}>NOMINATE</UIText.Title>
        <List.Root style={styles.NominateList}>
          {playerRows}
        </List.Root>
        <Button.Wrapper style={styles.nominateButton}>
          <Button onPress={this._onNominate} disabled={!this._didSelectCorrectNumber()}>
            NOMINATE
          </Button>
        </Button.Wrapper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
  },
  title: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rowName: {
    flex: 1,
  },
  NominateList: {
    marginHorizontal: 30,
  },
  nominateButton: {
    marginTop: 20,
  },
  WaitingText: {
    textAlign: 'center',
  },
});
