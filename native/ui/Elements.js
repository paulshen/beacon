import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export const Button = (props) => (
  <TouchableOpacity {...props} style={[ButtonStyles, props.style]}>
    <Text>{props.children}</Text>
  </TouchableOpacity>
);
const ButtonStyles = {
  borderColor: '#202020',
  borderWidth: 2,
  paddingHorizontal: 50,
  paddingVertical: 10,
};