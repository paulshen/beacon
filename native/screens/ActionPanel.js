import React from 'react-native';

import { Stage } from '../Avalon';
import NominatePane from './action_panes/NominatePane';

export default class ActionPanel extends React.Component {
  render() {
    let avalonState = this.props.avalon.getState();
    switch (avalonState.stage) {
    case Stage.Nominating:
      return <NominatePane {...this.props} avalonState={avalonState} />;
    case Stage.Voting:
      return;
    case Stage.Questing:
      return;
    }
  }
}
