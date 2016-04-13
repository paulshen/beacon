import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Stage } from '../Avalon';

export default class ActionPanel extends React.Component {
  render() {
    let avalonState = this.props.avalon.getState();
    switch (avalonState.stage) {
    case Stage.Nominating:
      return;
    case Stage.Voting:
      return;
    case Stage.Questing:
      return;
    }
  }
}