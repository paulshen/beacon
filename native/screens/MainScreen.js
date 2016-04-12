import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';

class MainScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {JSON.stringify(this.props.avalon.getRoles())}
        </Text>
      </View>
    );
  }
}

MainScreen = withGameState(MainScreen);
export default MainScreen;

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
