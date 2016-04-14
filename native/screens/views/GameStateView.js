import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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
    let content = <Text style={styles.label}>{this.props.questSize}</Text>;
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questView: {
    width: 20,
    height: 20,
  },
  success: {
    backgroundColor: 'green',
  },
  fail: {
    backgroundColor: 'red',
  },
});