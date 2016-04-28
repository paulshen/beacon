import React, {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button, List, Screen, UIText } from '../ui/Elements.js';
import Colors from '../ui/Colors';

export default class VotingResultScreen extends React.Component {
  render() {
    let { avalon, gameState, questIndex, nominationIndex } = this.props;
    let nomination = avalon.getNominationByIndex(questIndex, nominationIndex);
    let nominees = nomination.nominees.map((nomineeKey) => (
      <List.Item key={nomineeKey}><UIText.Body>{gameState.getNameForPlayerKey(nomineeKey)}</UIText.Body></List.Item>
    ));
    let votes = Object.keys(nomination.votes).map((playerKey) => (
      <List.Item style={styles.row} key={playerKey}>
        <UIText.Body style={styles.rowLabel}>{gameState.getNameForPlayerKey(playerKey)}</UIText.Body>
        <UIText.Body style={nomination.votes[playerKey] ? styles.SuccessText : styles.FailText}>
          {nomination.votes[playerKey] ? 'Approve' : 'Reject'}
        </UIText.Body>
      </List.Item>
    ));
    return (
      <Screen>
        <ScrollView>
          <View style={styles.container}>
            <UIText.Title style={[styles.verdict, avalon.isNominationPass(nomination) ? styles.SuccessText : styles.FailText]}>
              {'NOMINATION '}
              {avalon.isNominationPass(nomination) ? 'APPROVED' : 'REJECTED'}
            </UIText.Title>
            <List.Root>{nominees}</List.Root>
            <UIText.Title style={styles.label}>VOTES</UIText.Title>
            <List.Root>{votes}</List.Root>
            <Button.Wrapper style={styles.okayButton}>
              <Button onPress={() => this.props.onDismiss()}>OKAY</Button>
            </Button.Wrapper>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  label: {
    textAlign: 'center',
    margin: 10,
  },
  row: {
    flexDirection: 'row',
  },
  rowLabel: {
    flex: 1,
  },
  verdict: {
    marginBottom: 10,
    textAlign: 'center',
  },
  SuccessText: {
    color: Colors.Success,
  },
  FailText: {
    color: Colors.Fail,
  },
  okayButton: {
    marginTop: 20,
  },
});
