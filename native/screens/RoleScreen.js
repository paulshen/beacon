import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Role } from '../Avalon.js';
import { Button } from '../ui/Elements.js';

class RoleKnowledgeDisplay extends React.Component {
  _getKnownRolesDescription(role) {
    switch (role) {
    case Role.Merlin:
      return 'The Minions (except Mordred):';
    case Role.Percival:
      return 'Merlin and Morgana (in no particular order):';
    case Role.Minion:
    case Role.Assassin:
    case Role.Morgana:
    case Role.Mordred:
      return 'Your Fellow Minions (except Mordred):';
    default:
      return null;
    }
  }

  render() {
    let { gameState, avalon } = this.props;
    let roles = avalon.getRoles();
    let playerRole = avalon.getRoleForPlayerKey(gameState.getPlayerKey());
    let knownRolesDescription = this._getKnownRolesDescription(playerRole);
    if (!knownRolesDescription) {
      return null;
    }

    let knownRoles = avalon.getKnownRolesForPlayerKey(gameState.getPlayerKey());
    let knownPlayersList = Object.keys(roles).map((playerKey) => {
      if (knownRoles.indexOf(roles[playerKey]) !== -1) {
        return (
          <View key={playerKey}><Text>{gameState.getNameForPlayerKey(playerKey)}</Text></View>
        );
      } else {
        return null;
      }
    });
    return (
      <View>
        <Text>
          {knownRolesDescription}
        </Text>
        {knownPlayersList}
      </View>
    );
  }
};

export default class RoleScreen extends React.Component {
  render() {
    let { gameState, avalon } = this.props;
    let playerRole = avalon.getRoleForPlayerKey(gameState.getPlayerKey());
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {gameState.getPlayerName()}
        </Text>
        <Text style={styles.label}>
          You are {playerRole}
        </Text>
        <RoleKnowledgeDisplay gameState={gameState} avalon={avalon} />
        <Button onPress={() => this.props.onDismiss()}>Okay</Button>
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
});
