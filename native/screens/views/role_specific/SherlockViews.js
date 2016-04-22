import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Role } from '../../../Avalon.js';
import { List, UIText } from '../../../ui/Elements.js';
import Colors from '../../../ui/Colors.js';

export function isSherlockInspecting(gameState, avalon, avalonState) {
  let playerKey = gameState.getPlayerKey();
  return (
    avalon.getRoleForPlayerKey(playerKey) === Role.Sherlock &&
    avalonState.nominees.indexOf(playerKey) === -1 &&
    !avalon.hasSherlockInspected(avalonState.questIndex)
  );
}

export class SherlockInspect extends React.Component {
  render() {
    let { gameState, avalon, avalonState } = this.props;
    let nomineeRows = avalonState.nominees.map((nomineeKey) => {
      return (
        <List.Item key={nomineeKey}>
          <TouchableOpacity onPress={() => avalon.sherlockInspect(avalonState.questIndex, nomineeKey)}>
            <UIText.Body style={styles.nomineeText}>
              {gameState.getNameForPlayerKey(nomineeKey)}
            </UIText.Body>
          </TouchableOpacity>
        </List.Item>
      );
    });

    return (
      <View>
        <UIText.Title style={styles.label}>CHOOSE SOMEONE TO INSPECT</UIText.Title>
        <List.Root style={styles.nominees}>{nomineeRows}</List.Root>
      </View>
    );
  }
}

export class SherlockResult extends React.Component {
  render() {
    let { gameState, avalon, questOutcome } = this.props;
    if (avalon.getRoleForPlayerKey(gameState.getPlayerKey()) !== Role.Sherlock ||
        !questOutcome.sherlockInspected) {
      return null;
    }

    let inspectedPlayerName = gameState.getNameForPlayerKey(questOutcome.sherlockInspected);
    let inspectedPlayerAction = questOutcome.sherlockInspectedAction ? "Success" : "Fail";
    return (
      <View style={this.props.style}>
        <UIText.Body style={styles.infoText}>
          You inspected {inspectedPlayerName}'s action: {inspectedPlayerAction}
        </UIText.Body>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  nominees: {
    marginHorizontal: 50,
  },
  nomineeText: {
    textAlign: 'center',
    marginBottom: 3,
    marginTop: 3,
  },
  infoText: {
    borderWidth: 1,
    borderColor: Colors.Info,
    color: Colors.Info,
    padding: 10,
    textAlign: 'center',
  },
});