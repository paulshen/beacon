import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';

class WaitingRoomScreen extends React.Component {
  render() {
    let players = this.props.gameState.getPlayers();
    if (!players) {
      throw new Error('Unexpected falsy players');
    }

    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Game: {this.props.gameState.getGameId()}
        </Text>
        {Object.keys(players).map((playerKey) => {
          let playerName = players[playerKey];
          return (
            <Text key={playerKey}>
              {playerName}{this.props.gameState.getPlayerKey() === playerKey ? ' (you)' : null}
            </Text>
          );
        })}
        <TouchableOpacity onPress={() => this.props.avalon.start()}>
          <Text>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

WaitingRoomScreen = withGameState(WaitingRoomScreen);
export default WaitingRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
