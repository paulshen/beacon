import React, {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Button, List, UIText } from '../../ui/Elements.js';
import { isSherlockInspecting, SherlockInspect } from './role_specific/SherlockViews.js';
import { isKilgraveChoosing, KilgraveChoose, KilgraveControlled } from './role_specific/KilgraveViews.js';

export default class QuestPane extends React.Component {
  render() {
    let { gameState, avalon, avalonState } = this.props;

    let isTakingAction = (
      avalonState.nominees.indexOf(gameState.getPlayerKey()) !== -1 &&
      !(gameState.getPlayerKey() in avalonState.actions)
    );
    let bottomView;
    if (isTakingAction) {
      bottomView = <ActionButtons {...this.props} />;
    } else if (isSherlockInspecting(gameState, avalon, avalonState)) {
      bottomView = <SherlockInspect {...this.props} />;
    } else if (isKilgraveChoosing(gameState, avalon, avalonState)) {
      bottomView = <KilgraveChoose {...this.props} />;
    } else {
      bottomView =
        <View style={styles.container}>
          <UIText.Body style={styles.WaitingText}>
            Waiting for others...
          </UIText.Body>
        </View>;
    }

    return (
      <View style={styles.container}>
        <UIText.Title style={styles.title}>
          QUEST IN PROGRESS
        </UIText.Title>
        <List.Root>
          {avalonState.nominees.map((playerKey) => {
            return (
              <List.Item key={playerKey}>
                <UIText.Body>
                  {gameState.getNameForPlayerKey(playerKey)}
                </UIText.Body>
              </List.Item>
            );
          })}
        </List.Root>
        <View style={styles.BottomView}>
          {bottomView}
        </View>
      </View>
    );
  }
}

class ActionButtons extends React.Component {
  render() {
    let { gameState, avalon, avalonState } = this.props;
    let failButton =
      <Button style={styles.QuestButton} onPress={() => avalon.questAction(avalonState.questIndex, false)}>
        FAIL
      </Button>;
    let successButton =
      <Button style={styles.QuestButton} onPress={() => avalon.questAction(avalonState.questIndex, true)}>
        SUCCESS
      </Button>;

    if (avalon.getKilgraveTarget(avalonState.questIndex) === gameState.getPlayerKey()) {
      return (
        <View>
          <KilgraveControlled style={styles.kilgraveControlled} />
          <View style={styles.buttonsContainer}>
            {failButton}
          </View>
        </View>
      );
    } else if (avalon.isGood(gameState.getPlayerKey())) {
      return (
        <View style={styles.buttonsContainer}>
          {successButton}
        </View>
      );
    } else {
      return (
        <View style={styles.buttonsContainer}>
          {failButton}
          {successButton}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kilgraveControlled: {
    marginBottom: 20,
  },
  BottomView: {
    marginTop: 20,
  },
  QuestButton: {
    marginHorizontal: 20,
  },
  WaitingText: {
    textAlign: 'center',
  },
});
