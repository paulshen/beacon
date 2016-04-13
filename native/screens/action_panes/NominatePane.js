import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button } from '../../ui/Elements';

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
      return <View><Text>Waiting...</Text></View>;
    }

    let players = gameState.getPlayers();
    let playerRows = Object.keys(players).map((playerKey) => {
      return (
        <View style={styles.row} key={playerKey}>
          <Text style={styles.rowName}>{gameState.getNameForPlayerKey(playerKey)}</Text>
          <TouchableOpacity onPress={() => this._toggleNominee(playerKey)}>
            <Text style={styles.rowName}>
              {this.state.nomineeKeys.indexOf(playerKey) !== -1 ? 'Unselect' : 'Select'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <View style={styles.root}>
        <Text style={styles.title}>Nominate</Text>
        {playerRows}
        <View style={styles.nominateButton}>
          <Button onPress={this._onNominate} disabled={!this._didSelectCorrectNumber()}>
            Nominate
          </Button>
        </View>
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
  nominateButton: {
    alignItems: 'center',
    marginTop: 50,
  },
});
