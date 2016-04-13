import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export const Button = (props) => (
  <TouchableOpacity
    {...props}
    style={[ButtonStyles.Root, props.disabled && ButtonStyles.Disabled, props.style]}>
    <Text>{props.children}</Text>
  </TouchableOpacity>
);
const ButtonStyles = {
  Root: {
    borderColor: '#202020',
    borderWidth: 2,
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  Disabled: {
    borderColor: '#cccccc',
  },
};
