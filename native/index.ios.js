import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import JoinScreen from './screens/JoinScreen';
import HomeScreen from './screens/HomeScreen';

const Screens = {
  Join: 0,
  Home: 1,
}

class beacon extends Component {
  state = {
    currentScreen: Screens.Join,
  };

  render() {
    switch (this.state.currentScreen) {
      case Screens.Join:
        return (
          <JoinScreen onContinue={() => this.setState({currentScreen: Screens.Home})} />
        );
      case Screens.Home:
        return (
          <HomeScreen />
        );
    }
  }
}

AppRegistry.registerComponent('beacon', () => beacon);
