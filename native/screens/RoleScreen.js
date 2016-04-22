import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Role } from '../Avalon.js';
import { Button, List, Screen, UIText } from '../ui/Elements.js';
import Colors from '../ui/Colors';

class RoleKnowledgeDisplay extends React.Component {
  _getKnownRolesDescription(role, avalon) {
    switch (role) {
    case Role.Merlin:
      if (avalon.isRoleInGame(Role.Mordred)) {
        return 'The Minions\n(except Mordred)';
      } else {
        return 'The Minions';
      }
    case Role.Percival:
      return 'Merlin and Morgana\n(in no particular order)';
    case Role.Minion:
    case Role.Assassin:
    case Role.Morgana:
    case Role.Mordred:
    case Role.Kilgrave:
      if (avalon.isRoleInGame(Role.Oberon)) {
        return 'Your Fellow Minions\n(except Oberon)';
      } else {
        return 'Your Fellow Minions';
      }
    default:
      return null;
    }
  }

  render() {
    let { gameState, avalon } = this.props;
    let roles = avalon.getRoles();
    let playerRole = avalon.getRoleForPlayerKey(gameState.getPlayerKey());
    let knownRolesDescription = this._getKnownRolesDescription(playerRole, avalon);
    if (!knownRolesDescription) {
      return null;
    }

    let knownRoles = avalon.getKnownRolesForPlayerKey(gameState.getPlayerKey());
    let knownPlayersList = Object.keys(roles).map((playerKey) => {
      if (knownRoles.indexOf(roles[playerKey]) !== -1) {
        return (
          <List.Item key={playerKey}>
            <UIText.Body>{gameState.getNameForPlayerKey(playerKey)}</UIText.Body>
          </List.Item>
        );
      } else {
        return null;
      }
    });
    return (
      <View>
        <UIText.Title style={styles.KnownRoleDescriptionTitle}>
          {knownRolesDescription.toUpperCase()}
        </UIText.Title>
        <List.Root style={styles.KnownRolesList}>
          {knownPlayersList}
        </List.Root>
      </View>
    );
  }
};

export default class RoleScreen extends React.Component {
  render() {
    let { gameState, avalon } = this.props;
    let playerKey = gameState.getPlayerKey();
    let playerRole = avalon.getRoleForPlayerKey(playerKey);
    return (
      <Screen style={styles.container}>
        <UIText.Title style={styles.label}>
          {'YOUR ROLE: '}
          <Text style={avalon.isGood(playerKey) ? styles.GoodText : styles.EvilText}>
            {playerRole.toUpperCase()}
          </Text>
        </UIText.Title>
        <RoleKnowledgeDisplay gameState={gameState} avalon={avalon} />
        <Button.Wrapper style={styles.Button}>
          <Button onPress={() => this.props.onDismiss()}>OKAY</Button>
        </Button.Wrapper>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  label: {
    textAlign: 'center',
    margin: 10,
  },
  KnownRoleDescriptionTitle: {
    marginTop: 30,
    textAlign: 'center',
  },
  KnownRolesList: {
    marginBottom: 30,
    marginHorizontal: 60,
  },
  Button: {
    marginTop: 50,
  },
  GoodText: {
    color: Colors.Success,
  },
  EvilText: {
    color: Colors.Fail,
  },
});
