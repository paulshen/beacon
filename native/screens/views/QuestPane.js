import React, {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Button } from '../../ui/Elements.js';
import { isSherlockInspecting, SherlockInspect } from './role_specific/SherlockViews.js';

export default class QuestPane extends React.Component {
  render() {
    let { gameState, avalon, avalonState } = this.props;

    let isTakingAction = (
      avalonState.nominees.indexOf(gameState.getPlayerKey()) !== -1 &&
      !(gameState.getPlayerKey() in avalonState.actions)
    );
    let bottomView;
    if (isTakingAction) {
      bottomView =
        <View style={styles.buttonsContainer}>
          <Button onPress={() => avalon.questAction(avalonState.questIndex, false)}>
            Fail
          </Button>
          <Button onPress={() => avalon.questAction(avalonState.questIndex, true)}>
            Success
          </Button>
        </View>;
    } else if (isSherlockInspecting(gameState, avalon, avalonState)) {
      bottomView = <SherlockInspect {...this.props} />;
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