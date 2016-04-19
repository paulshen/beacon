import React, {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Button } from '../../ui/Elements.js';
import { isSherlockInspecting, SherlockInspect } from './role_specific/SherlockViews.js';
import { isKilgraveChoosing, KilgraveChoose } from './role_specific/KilgraveViews.js';

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
          <Text>
            Waiting for others...
          </Text>
        </View>;
    }

    return (
      <View style={styles.container}>
        <Text>
          Quest in progress:
        </Text>
        {avalonState.nominees.map((playerKey) => {
          return (
            <Text key={playerKey}>
              {gameState.getNameForPlayerKey(playerKey)}
            </Text>
          );
        })}
        {bottomView}
      </View>
    );
  }
}

class ActionButtons extends React.Component {
  render() {
    let { gameState, avalon, avalonState } = this.props;
    let failButton =
      <Button onPress={() => avalon.questAction(avalonState.questIndex, false)}>
        Fail
      </Button>;
    let successButton =
      <Button onPress={() => avalon.questAction(avalonState.questIndex, true)}>
        Success
      </Button>;

    if (avalon.getKilgraveTarget(avalonState.questIndex) === gameState.getPlayerKey()) {
      return (
        <View style={styles.container}>
          <Text>You are being mind controlled by Kilgrave</Text>
          {failButton}
        </View>
      );
    } else if (avalon.isGood(gameState.getPlayerKey())) {
      return successButton;
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
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});