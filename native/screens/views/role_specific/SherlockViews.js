import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Role } from '../../../Avalon.js';

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
        <View key={nomineeKey}>
          <TouchableOpacity onPress={() => avalon.sherlockInspect(avalonState.questIndex, nomineeKey)}>
            <Text>{gameState.getNameForPlayerKey(nomineeKey)}</Text>
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <View>
        <Text>Inspect a player's action:</Text>
        {nomineeRows}
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
      <View>
        <Text>
          {inspectedPlayerName}'s action was {inspectedPlayerAction}
        </Text>
      </View>
    );
  }
}