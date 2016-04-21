import React, {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button, Cells, List, Screen, UIText } from '../ui/Elements.js';
import { SherlockResult } from './views/role_specific/SherlockViews.js';
import Colors from '../ui/Colors';

export default class QuestResultScreen extends React.Component {
  render() {
    let { avalon, gameState, questIndex } = this.props;
    let questOutcome = avalon.getQuestOutcome(questIndex);
    if (!questOutcome) {
      throw new Error('showing QuestResultScreen without quest');
    }
    let nominees = questOutcome.nominees.map((nomineeKey) => (
      <List.Item key={nomineeKey}><UIText.Body>{gameState.getNameForPlayerKey(nomineeKey)}</UIText.Body></List.Item>
    ));
    return (
      <Screen style={styles.container}>
        <UIText.Title style={styles.label}>NOMINEES</UIText.Title>
        <List.Root style={styles.nominees}>{nominees}</List.Root>
        <UIText.Title style={styles.label}>
          {'OUTCOME: '}
          <Text style={questOutcome.verdict ? styles.SuccessText : styles.FailText}>
            {questOutcome.verdict ? 'SUCCEED' : 'FAIL'}
          </Text>
        </UIText.Title>
        <Cells.Root>
          <Cells.Item>
            <UIText.Title>SUCCEED</UIText.Title>
            <UIText.Body>{questOutcome.numSuccess}</UIText.Body>
          </Cells.Item>
          <Cells.Item>
            <UIText.Title>FAIL</UIText.Title>
            <UIText.Body>{questOutcome.numFail}</UIText.Body>
          </Cells.Item>
        </Cells.Root>
        <SherlockResult {...this.props} questOutcome={questOutcome} />
        <Button.Wrapper style={styles.Button}>
          <Button onPress={() => this.props.onDismiss()}>OKAY</Button>
        </Button.Wrapper>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  label: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  nominees: {
    marginHorizontal: 30,
  },
  SuccessText: {
    color: Colors.Success,
  },
  FailText: {
    color: Colors.Fail,
  },
  Button: {
    marginTop: 20,
  },
});
