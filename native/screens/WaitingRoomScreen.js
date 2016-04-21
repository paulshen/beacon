import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';
import { Screen, Button, UIText, List } from '../ui/Elements';

class WaitingRoomScreen extends React.Component {
  render() {
    let players = this.props.gameState.getPlayers();
    if (!players) {
      throw new Error('Unexpected falsy players');
    }

    return (
      <Screen style={styles.container}>
        <UIText.Title style={styles.label}>
          GAME {this.props.gameState.getGameId()}
        </UIText.Title>
        <List.Root>
        {Object.keys(players).map((playerKey) => {
          let playerName = players[playerKey];
          return (
            <List.Item key={playerKey}>
              <UIText.Body>
                {playerName}{this.props.gameState.getPlayerKey() === playerKey ? ' (you)' : null}
              </UIText.Body>
            </List.Item>
          );
        })}
        </List.Root>
        <View style={styles.buttonWrapper}>
          <Button onPress={() => this.props.avalon.start()}>START</Button>
        </View>
      </Screen>
    );
  }
}

WaitingRoomScreen = withGameState(WaitingRoomScreen);
export default WaitingRoomScreen;

const styles = StyleSheet.create({
  container: {
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
