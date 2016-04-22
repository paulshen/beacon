import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { UIText } from '../../ui/Elements';
import Colors from '../../ui/Colors';

export default class GameStateView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.avalon.getQuestSizes().map((questSize, questIndex) => {
          return (
            <QuestView
              {...this.props}
              key={questIndex}
              questIndex={questIndex}
              questSize={questSize}
            />
          );
        })}
      </View>
    );
  }
}

class QuestView extends React.Component {
  render() {
    let content =
      <UIText.Body>
        {this.props.questSize.numParticipants}
        {this.props.questSize.numFailsRequired > 1 ? `/${this.props.questSize.numFailsRequired}` : null}
      </UIText.Body>;
    let outcome = this.props.avalon.getQuestOutcome(this.props.questIndex);

    if (outcome) {
      return (
        <TouchableOpacity
          style={[styles.questView, outcome.verdict ? styles.success : styles.fail]}
          onPress={() => this.props.showQuestResultModal(this.props.questIndex)}>
          {content}
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.questView}>
          {content}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderColor: '#19829b',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  questView: {
    alignItems: 'center',
    borderColor: '#0e4958',
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    marginHorizontal: 10,
    width: 40,
    height: 40,
  },
  success: {
    borderColor: Colors.Success,
  },
  fail: {
    borderColor: Colors.Fail,
  },
});
