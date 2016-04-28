import React from 'react-native';

import { Stage } from '../../Avalon';
import NominatePane from './NominatePane';
import VotePane from './VotePane';
import QuestPane from './QuestPane';

export default class ActionPanel extends React.Component {
  render() {
    switch (this.props.avalonState.stage) {
    case Stage.Nominating:
      return <NominatePane {...this.props} />;
    case Stage.Voting:
      return <VotePane {...this.props} />;
    case Stage.Questing:
      return <QuestPane {...this.props} />;
    case Stage.GameOver:
      return null;
    }
  }
}
