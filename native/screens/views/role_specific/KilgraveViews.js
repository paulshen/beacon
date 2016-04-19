import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Role } from '../../../Avalon.js';
import { Button } from '../../../ui/Elements.js';

export function isKilgraveChoosing(gameState, avalon, avalonState) {
  return (
    avalon.getRoleForPlayerKey(gameState.getPlayerKey()) === Role.Kilgrave &&
    !avalon.hasKilgraveChosen(avalonState.questIndex + 1)
  );
}

export class KilgraveChoose extends React.Component {
  render() {
    let { gameState, avalon, avalonState } = this.props;
    let playerRows = Object.keys(gameState.getPlayers()).map((playerKey) => {
      return (
        <View key={playerKey}>
          <TouchableOpacity onPress={() => avalon.kilgraveMindControl(avalonState.questIndex + 1, playerKey)}>
            <Text>{gameState.getNameForPlayerKey(playerKey)}</Text>
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <View>
        <Text>Choose a player to mind-control during the next quest (one use per game):</Text>
        {playerRows}
        <Button onPress={() => avalon.kilgraveMindControl(avalonState.questIndex + 1, null)}>Save for later</Button>
      </View>
    );
  }
}

export class KilgraveInfo extends React.Component {
  render() {
    let { gameState, avalon, avalonState } = this.props;
    let kilgraveTarget = avalon.getKilgraveTarget(avalonState.questIndex);
    if (avalon.getRoleForPlayerKey(gameState.getPlayerKey()) !== Role.Kilgrave ||
        !kilgraveTarget) {
      return null;
    }

    let targetPlayerName = gameState.getNameForPlayerKey(kilgraveTarget);
    return (
      <View>
        <Text>
          You are mind controlling {targetPlayerName} during this quest
        </Text>
      </View>
    );
  }
}