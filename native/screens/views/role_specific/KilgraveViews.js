import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Role } from '../../../Avalon.js';
import { Button, List, UIText } from '../../../ui/Elements.js';
import Colors from '../../../ui/Colors.js';

export function isKilgraveChoosing(gameState, avalon, avalonState) {
  return (
    avalon.getRoleForPlayerKey(gameState.getPlayerKey()) === Role.Kilgrave &&
    !avalon.hasKilgraveChosen(avalonState.questIndex + 1)
  );
}

export class KilgraveChoose extends React.Component {
  _getButtonText(questIndex) {
    switch (questIndex) {
    case 0:
      return "Save for quest 3 or 4";
    case 1:
      return "Save for quest 4";
    case 2:
      return "Don't use";
    default:
      throw new Error(`shouldn't show Kilgrave choice during quest ${questIndex}`);
    }
  }

  render() {
    let { gameState, avalon, avalonState } = this.props;
    let playerRows = Object.keys(gameState.getPlayers()).map((playerKey) => {
      return (
        <List.Item key={playerKey}>
          <TouchableOpacity onPress={() => avalon.kilgraveMindControl(avalonState.questIndex + 1, playerKey)}>
            <UIText.Body style={styles.playerText}>
              {gameState.getNameForPlayerKey(playerKey)}
            </UIText.Body>
          </TouchableOpacity>
        </List.Item>
      );
    });

    return (
      <View>
        <UIText.Title style={styles.title}>CHOOSE A PLAYER TO MIND CONTROL DURING THE NEXT QUEST</UIText.Title>
        <UIText.Body style={styles.subtitle}>(one use per game)</UIText.Body>
        <List.Root style={styles.players}>
          {playerRows}
        </List.Root>
        <Button.Wrapper>
          <Button onPress={() => avalon.kilgraveMindControl(avalonState.questIndex + 1, null)}>
            {this._getButtonText(avalonState.questIndex)}
          </Button>
        </Button.Wrapper>
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
      <View style={this.props.style}>
        <UIText.Body style={styles.infoText}>
          You are mind controlling {targetPlayerName} during this quest
        </UIText.Body>
      </View>
    );
  }
}

export class KilgraveControlled extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        <UIText.Body style={styles.infoText}>
          You are being mind controlled by Kilgrave
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
  title: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 10,
  },
  players: {
    marginHorizontal: 50,
  },
  playerText: {
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