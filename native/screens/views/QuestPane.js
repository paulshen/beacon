import React, {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Button } from '../../ui/Elements.js';

export default class QuestPane extends React.Component {
  render() {
    // if the player is not on the mission or has completed their action, show the waiting state
    let bottomView;
    if (this.props.avalonState.nominees.indexOf(this.props.gameState.getPlayerKey()) === -1 ||
        this.props.gameState.getPlayerKey() in this.props.avalonState.actions) {
      bottomView =
        <View style={styles.container}>
          <Text>
            Waiting for others...
          </Text>
        </View>;
    } else {
      bottomView =
        <View style={styles.buttonsContainer}>
          <Button onPress={() => this.props.avalon.questAction(this.props.avalonState.questIndex, false)}>
            Fail
          </Button>
          <Button onPress={() => this.props.avalon.questAction(this.props.avalonState.questIndex, true)}>
            Success
          </Button>
        </View>;
    }

    return (
      <View style={styles.container}>
        <Text>
          Quest in progress:
        </Text>
        {this.props.avalonState.nominees.map((playerKey) => {
          return (
            <Text key={playerKey}>
              {this.props.gameState.getNameForPlayerKey(playerKey)}
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