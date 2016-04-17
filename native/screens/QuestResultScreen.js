import React, {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '../ui/Elements.js';
import { SherlockResult } from './views/role_specific/SherlockViews.js';

export default class QuestResultScreen extends React.Component {
  render() {
    let { avalon, gameState, questIndex } = this.props;
    let questOutcome = avalon.getQuestOutcome(questIndex);
    if (!questOutcome) {
      throw new Error('showing QuestResultScreen without quest');
    }
    let nominees = questOutcome.nominees.map((nomineeKey) => (
      <View key={nomineeKey}><Text>{gameState.getNameForPlayerKey(nomineeKey)}</Text></View>
    ));
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Nominees</Text>
        <View>{nominees}</View>
        <Text style={styles.label}>Outcome</Text>
        <View><Text>Succeed: {questOutcome.numSuccess}</Text></View>
        <View><Text>Fail: {questOutcome.numFail}</Text></View>
        <View><Text>Verdict: {questOutcome.verdict ? 'Succeed' : 'Fail'}</Text></View>
        <SherlockResult {...this.props} questOutcome={questOutcome} />
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
