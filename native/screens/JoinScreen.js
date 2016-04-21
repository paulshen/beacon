import React, {
  StyleSheet,
  View
} from 'react-native';

import { Button, Screen, UIText } from '../ui/Elements';
import { joinGame } from '../GameState';

export default class JoinScreen extends React.Component {
  state = {
    gameId: '',
    name: '',
  };

  _onPressJoin = () => {
    joinGame(this.state.gameId)
    .then((gameState) => gameState.setPlayer(this.state.name));
  };

  render() {
    return (
      <Screen>
        <UIText.Title style={styles.label}>GAME ID</UIText.Title>
        <UIText.Input
          style={styles.input}
          onChangeText={(gameId) => this.setState({gameId})}
          value={this.state.gameId}
          autoCorrect={false}
        />
        <UIText.Title style={styles.label}>NAME</UIText.Title>
        <UIText.Input
          style={styles.input}
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          autoCorrect={false}
        />
        <Button.Wrapper>
          <Button onPress={this._onPressJoin}>JOIN</Button>
        </Button.Wrapper>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    marginBottom: 40,
    marginHorizontal: 30,
  },
});
