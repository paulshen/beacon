import React, {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Button } from '../../ui/Elements.js';

export default class QuestPane extends React.Component {
  render() {
    // if the player is not on the mission or has completed their action, show the waiting state
    if (!(this.props.gameState.getPlayerKey() in this.props.avalonState.nominees) ||
        this.props.gameState.getPlayerKey() in this.props.avalonState.actions) {
      return (
        <View style={styles.container}>
          <Text>
            Waiting for others...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
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