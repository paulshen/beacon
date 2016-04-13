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
    if (!gameState.getPlayers() || !gameState.getPlayerKey()) {
      return <JoinScreen />;
    }
    if (avalon.getRoles() && avalon.getInitialLeaderKey()) {
      return <MainScreen />;
    }
    return <WaitingRoomScreen />;
  }
}

Beacon = withGameState(Beacon);

AppRegistry.registerComponent('beacon', () => Beacon);
