import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';
import { Button, UIText } from '../ui/Elements';

class SelectRolesScreen extends React.Component {
  state = {
    selectedRolesByTeam: {},
  };

  _toggleRole = (role, team, maxCount) => {
    if (!(team in this.state.selectedRolesByTeam)) {
      this.state.selectedRolesByTeam[team] = [];
    }

    let roleIndex = this.state.selectedRolesByTeam[team].indexOf(role);
    if (roleIndex !== -1) {
      this.state.selectedRolesByTeam[team].splice(roleIndex, 1);
    } else {
      if (this.state.selectedRolesByTeam[team].length >= maxCount) {
        return;
      }
      this.state.selectedRolesByTeam[team].push(role);
    }
    this.setState({
      selectedRolesByTeam: this.state.selectedRolesByTeam,
    });
  };

  render() {
    let selectableRolesByTeam = this.props.avalon.getSelectableRolesByTeam();

    let teamSections = Object.keys(selectableRolesByTeam).map((team) => {
      let roleRows = selectableRolesByTeam[team].roles.map((role) => {
        let isRoleSelected = (
          team in this.state.selectedRolesByTeam &&
          this.state.selectedRolesByTeam[team].indexOf(role) !== -1
        );
        return (
          <View style={styles.row} key={role}>
            <Text style={styles.rowName}>{role}</Text>
            <TouchableOpacity onPress={() => this._toggleRole(role, team, selectableRolesByTeam[team].maxCount)}>
              <Text style={styles.rowName}>
                {isRoleSelected ? 'Unselect' : 'Select'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });

      return (
        <View key={team}>
          <Text>{team} Team (select up to {selectableRolesByTeam[team].maxCount})</Text>
          {roleRows}
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <UIText.Title style={styles.label}>
          Select Roles
        </UIText.Title>
        {teamSections}
        <View style={styles.buttonWrapper}>
          <Button onPress={() => this.props.avalon.assignRoles(this.state.selectedRolesByTeam)}>Done</Button>
        </View>
      </View>
    );
  }
}

SelectRolesScreen = withGameState(SelectRolesScreen);
export default SelectRolesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    textAlign: 'center',
    margin: 10,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 50,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rowName: {
    flex: 1,
  },
});
