import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import JoinScreen from './screens/JoinScreen';
import WaitingRoomScreen from './screens/WaitingRoomScreen';
import MainScreen from './screens/MainScreen';
import { withGameState } from './GameState';

class Beacon extends Component {
  render() {
    let { gameState, avalon } = this.props;
    if (avalon.getRoles() && avalon.getInitialLeaderKey()) {
      return <MainScreen />;
    }
    if (gameState.getPlayers() && gameState.getPlayerKey()) {
      return <WaitingRoomScreen />;
    }
    return <JoinScreen />;
  }
}

Beacon = withGameState(Beacon);

AppRegistry.registerComponent('beacon', () => Beacon);
