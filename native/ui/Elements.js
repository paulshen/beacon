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
const ButtonStyles = StyleSheet.create({
  Root: {
    borderColor: '#202020',
    borderWidth: 2,
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  Disabled: {
    borderColor: '#cccccc',
  },
});

export const UIText = {
  Body: (props) => <Text {...props} style={[UITextStyles.Body, props.style]} />,
  Title: (props) => <Text {...props} style={[UITextStyles.Title, props.style]} />,
};

const UITextStyles = StyleSheet.create({
  Body: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 18,
  },
  Title: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});
