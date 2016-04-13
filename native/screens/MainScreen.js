import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';
import ActionPanel from './ActionPanel';

class MainScreen extends React.Component {
  _renderGameState(avalonState) {
    return (
      <View style={styles.gameStateContainer}>
        {this.props.avalon.getQuestSizes().map((questSize, questIndex) => {
          return (
            <Text key={questIndex} style={styles.label}>
              {questSize}
            </Text>
          );
        })}
      </View>
    );
  }

  _renderQuestInfo(avalonState) {
    return (
      <View style={styles.questInfoContainer}>
        <Text style={styles.label}>
          Current Quest
        </Text>
        <Text style={styles.label}>
          Leader: {this.props.gameState.getNameForPlayerKey(avalonState.leaderKey)}
        </Text>
        <Text style={styles.label}>
          Vote: {avalonState.nominationIndex + 1} of 5
        </Text>
      </View>
    );
  }

  render() {
    let avalonState = this.props.avalon.getState();

    return (
      <View style={styles.container}>
        {this._renderGameState(avalonState)}
        {this._renderQuestInfo(avalonState)}
        <ActionPanel gameState={this.props.gameState} avalon={this.props.avalon} avalonState={avalonState} />
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
  },
  gameStateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
