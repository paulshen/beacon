import React, {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '../ui/Elements.js';

export default class VotingResultScreen extends React.Component {
  render() {
    let { avalon, avalonState, gameState, questIndex, nominationIndex } = this.props;
    let nomination = avalon.getNominationByIndex(questIndex, nominationIndex);
    let nominees = nomination.nominees.map((nomineeKey) => (
      <View key={nomineeKey}><Text>{gameState.getNameForPlayerKey(nomineeKey)}</Text></View>
    ));
    let votes = Object.keys(nomination.votes).map((playerKey) => (
      <View style={styles.row} key={playerKey}>
        <Text style={styles.rowLabel}>{gameState.getNameForPlayerKey(playerKey)}</Text>
        <Text>{nomination.votes[playerKey] ? 'Approve' : 'Reject'}</Text>
      </View>
    ));
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Nominees</Text>
        <View>{nominees}</View>
        <Text style={styles.label}>Votes</Text>
        <View>{votes}</View>
        <View>
          <Text>Verdict: {avalon.isNominationPass(nomination) ? 'Pass' : 'Fail'}</Text>
        </View>
        <View style={styles.okayButton}>
          <Button onPress={() => this.props.onDismiss()}>Okay</Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  row: {
    flexDirection: 'row',
  },
  rowLabel: {
    flex: 1,
  },
  okayButton: {
    alignItems: 'center',
  },
});
