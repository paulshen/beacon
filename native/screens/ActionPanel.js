import React from 'react-native';

import { Stage } from '../Avalon';
import NominatePane from './action_panes/NominatePane';
import VotePane from './action_panes/VotePane';
import QuestPane from './action_panes/QuestPane';

export default class ActionPanel extends React.Component {
  render() {
    switch (this.props.avalonState.stage) {
    case Stage.Nominating:
      return <NominatePane {...this.props} />;
    case Stage.Voting:
      return <VotePane {...this.props} />;
    case Stage.Questing:
      return <QuestPane {...this.props} />;
    }
  }
}
