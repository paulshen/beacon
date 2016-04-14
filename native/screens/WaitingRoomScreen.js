import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';
import { Button, UIText } from '../ui/Elements';

class WaitingRoomScreen extends React.Component {
  render() {
    let players = this.props.gameState.getPlayers();
    if (!players) {
      throw new Error('Unexpected falsy players');
    }

    return (
      <View style={styles.container}>
        <UIText.Title style={styles.label}>
          GAME {this.props.gameState.getGameId()}
        </UIText.Title>
        {Object.keys(players).map((playerKey) => {
          let playerName = players[playerKey];
          return (
            <UIText.Body key={playerKey}>
              {playerName}{this.props.gameState.getPlayerKey() === playerKey ? ' (you)' : null}
            </UIText.Body>
          );
        })}
        <View style={styles.buttonWrapper}>
          <Button onPress={() => this.props.avalon.start()}>Start</Button>
        </View>
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
    paddingHorizontal: 20,
  },
  label: {
    textAlign: 'center',
    margin: 10,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 50,
  },
});
