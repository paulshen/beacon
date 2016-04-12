import React, {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { withGameState } from '../GameState';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {JSON.stringify(this.props.gameState.get())}
        </Text>
      </View>
    );
  }
}

HomeScreen = withGameState(HomeScreen);
export default HomeScreen;

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
