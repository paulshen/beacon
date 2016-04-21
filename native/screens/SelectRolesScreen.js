import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { withGameState } from '../GameState';
import { Button, List, Screen, UIText } from '../ui/Elements';

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
          <List.Item style={styles.row} key={role}>
            <UIText.Body style={styles.rowName}>{role}</UIText.Body>
            <TouchableOpacity onPress={() => this._toggleRole(role, team, selectableRolesByTeam[team].maxCount)}>
              <UIText.Body style={styles.rowName}>
                {isRoleSelected ? 'Unselect' : 'Select'}
              </UIText.Body>
            </TouchableOpacity>
          </List.Item>
        );
      });

      return (
        <View key={team} style={styles.TeamSection}>
          <UIText.Title style={styles.Title}>{`${team} Team (up to ${selectableRolesByTeam[team].maxCount})`.toUpperCase()}</UIText.Title>
          <List.Root>
            {roleRows}
          </List.Root>
        </View>
      );
    });

    return (
      <Screen style={styles.container}>
        {teamSections}
        <Button.Wrapper style={styles.buttonWrapper}>
          <Button onPress={() => this.props.avalon.assignRoles(this.state.selectedRolesByTeam)}>SELECT ROLES</Button>
        </Button.Wrapper>
      </Screen>
    );
  }
}

SelectRolesScreen = withGameState(SelectRolesScreen);
export default SelectRolesScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  label: {
    textAlign: 'center',
    margin: 10,
  },
  buttonWrapper: {
    marginTop: 20,
  },
  TeamSection: {
    marginBottom: 20,
  },
  Title: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  rowName: {
    flex: 1,
  },
});
