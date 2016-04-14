import React, {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Button } from '../ui/Elements';
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
      <View style={styles.container}>
        <Text style={styles.label}>
          Game ID:
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(gameId) => this.setState({gameId})}
          value={this.state.gameId}
          autoCorrect={false}
        />
        <Text style={styles.label}>
          Name:
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          autoCorrect={false}
        />
        <Button onPress={this._onPressJoin}>Join</Button>
      </View>
    );
  }
}

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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
  },
});
