import React, {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Button, List, UIText } from '../../ui/Elements.js';

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
          <UIText.Body style={styles.WaitingText}>
            Waiting for others to vote...
          </UIText.Body>
        </View>;
    } else {
      bottomView =
        <View style={styles.buttonsContainer}>
          <Button style={styles.Button} onPress={() => this._vote(false)}>
            REJECT
          </Button>
          <Button style={styles.Button} onPress={() => this._vote(true)}>
            APPROVE
          </Button>
        </View>;
    }

    return (
      <View style={styles.container}>
        <UIText.Title style={styles.Title}>
          {this.props.gameState.getNameForPlayerKey(this.props.avalonState.leaderKey).toUpperCase()} NOMINATED
        </UIText.Title>
        <List.Root style={styles.Nominees}>
          {this.props.avalonState.nominees.map((playerKey) => {
            return (
              <List.Item key={playerKey}>
                <UIText.Body>
                  {this.props.gameState.getNameForPlayerKey(playerKey)}
                </UIText.Body>
              </List.Item>
            );
          })}
        </List.Root>
        {bottomView}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  Title: {
    textAlign: 'center',
  },
  Nominees: {
    marginBottom: 40,
    marginHorizontal: 50,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Button: {
    marginHorizontal: 20,
    paddingHorizontal: 30,
  },
  WaitingText: {
    textAlign: 'center',
  },
});
