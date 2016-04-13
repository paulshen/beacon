import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';
import { Role } from '../Avalon.js';
import { Button } from '../ui/Elements.js';

const FellowMinionDisplay = ({ gameState, avalon }) => {
  let roles = avalon.getRoles();
  let minionList = Object.keys(roles).map((playerKey) => {
    switch (roles[playerKey]) {
    case Role.Minion:
      return (
        <View key={playerKey}><Text>{gameState.getNameForPlayerKey(playerKey)}</Text></View>
      );
    default:
      return null;
    }
  });
  return (
    <View>
      {minionList}
    </View>
  );
};

class RoleScreen extends React.Component {
  render() {
    let { gameState, avalon } = this.props;
    let playerRole = avalon.getRoleForPlayerKey(gameState.getPlayerKey());
    let additionalDisplay = null;
    if (playerRole === Role.Minion) {
      additionalDisplay = <FellowMinionDisplay gameState={gameState} avalon={avalon} />;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {gameState.getPlayerName()}
        </Text>
        <Text style={styles.label}>
          {playerRole}
        </Text>
        {additionalDisplay}
        <Button onPress={() => this.props.onDismiss()}>Okay</Button> 
      </View>
    );
  }
}

RoleScreen = withGameState(RoleScreen);
export default RoleScreen;

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
