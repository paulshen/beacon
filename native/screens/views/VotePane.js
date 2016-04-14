import React, {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Button } from '../../ui/Elements.js';

export default class VotePane extends React.Component {
  _vote(approve) {
    this.props.avalon.vote(
      this.props.avalonState.questIndex,
      this.props.avalonState.nominationIndex,
      approve
    );
  };

  render() {
    // if the player already voted, show the waiting state. otherwise show the buttons
    let bottomView;
    if (this.props.gameState.getPlayerKey() in this.props.avalonState.votes) {
      bottomView =
        <View style={styles.container}>
          <Text>
            Waiting for others to vote...
          </Text>
        </View>;
    } else {
      bottomView =
        <View style={styles.buttonsContainer}>
          <Button onPress={() => this._vote(false)}>
            Reject
          </Button>
          <Button onPress={() => this._vote(true)}>
            Approve
          </Button>
        </View>;
    }

    return (
      <View style={styles.container}>
        <Text>
          {this.props.gameState.getNameForPlayerKey(this.props.avalonState.leaderKey)} nominated:
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