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
import RoleScreen from './screens/RoleScreen';
import { withGameState } from './GameState';

class Beacon extends Component {
  state = {
    showingRoleModal: true,
  };

  render() {
    let { gameState, avalon } = this.props;
    if (!gameState.getPlayers() || !gameState.getPlayerKey()) {
      return <JoinScreen />;
    }
    if (avalon.getRoles() && avalon.getInitialLeaderKey()) {
      if (this.state.showingRoleModal) {
        return <RoleScreen onDismiss={() => this.setState({showingRoleModal: false})} />;
      }
      return <MainScreen />;
    }
    return <WaitingRoomScreen />;
  }
}

Beacon = withGameState(Beacon);

AppRegistry.registerComponent('beacon', () => Beacon);
