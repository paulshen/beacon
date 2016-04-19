import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import JoinScreen from './screens/JoinScreen';
import WaitingRoomScreen from './screens/WaitingRoomScreen';
import SelectRolesScreen from './screens/SelectRolesScreen';
import MainScreen from './screens/MainScreen';
import { withGameState } from './GameState';

class Beacon extends Component {
  render() {
    let { gameState, avalon } = this.props;
    if (!gameState.getPlayers() || !gameState.getPlayerKey()) {
      return <JoinScreen />;
    }
    if (avalon.getInitialLeaderKey()) {
      if (avalon.getRoles()) {
        return <MainScreen />;
      }
      return <SelectRolesScreen />;
    }
    return <WaitingRoomScreen />;
  }
}

Beacon = withGameState(Beacon);

AppRegistry.registerComponent('beacon', () => Beacon);
