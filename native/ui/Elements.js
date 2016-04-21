import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import React from 'react';

export const Screen = (props) => (
  <View {...props} style={[ScreenStyles.Root, props.style]} />
);
const ScreenStyles = StyleSheet.create({
  Root: {
    backgroundColor: '#061F25',
    flex: 1,
    justifyContent: 'center',
  },
});

export let Button = (props) => (
  <TouchableOpacity
    {...props}
    style={[ButtonStyles.Root, props.disabled && ButtonStyles.Disabled, props.style]}>
    <Text style={[ButtonStyles.Text, props.disabled && ButtonStyles.TextDisabled]}>{props.children}</Text>
  </TouchableOpacity>
);
Button.Wrapper = (props) => <View {...props} style={[ButtonStyles.Wrapper, props.style]} />;
Button.Small = (props) => <Button {...props} style={[ButtonStyles.Small, props.style]} />;
const ButtonStyles = StyleSheet.create({
  Root: {
    backgroundColor: '#092d36',
    borderColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  Text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  TextDisabled: {
    color: '#092d36',
  },
  Disabled: {
    backgroundColor: 'transparent',
    borderColor: '#092d36',
  },
  Wrapper: {
    alignItems: 'center',
  },
  Small: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

export const UIText = {
  Body: (props) => <Text {...props} style={[UITextStyles.Body, props.style]} />,
  Title: (props) => <Text {...props} style={[UITextStyles.Title, props.style]} />,
  Input: (props) => <TextInput {...props} style={[UITextStyles.Input, props.style]} />,
};
const UITextStyles = StyleSheet.create({
  Body: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 18,
  },
  Title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
  },
  Input: {
    backgroundColor: '#092d36',
    color: '#ffffff',
    height: 40,
    borderColor: '#ffffff',
    borderRadius: 2,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});

export const List = {
  Root: (props) => <View {...props} style={[ListStyles.Root, props.style]} />,
  Item: (props) => <View {...props} style={[ListStyles.Item, props.style]} />,
};
const ListStyles = StyleSheet.create({
  Root: {
    borderColor: '#0e4958',
    borderLeftWidth: 2,
    borderRadius: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  Item: {
    borderBottomWidth: 2,
    borderColor: '#0e4958',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export const Cells = {
  Root: (props) => {
    let newChildren = [];
    React.Children.forEach(props.children, (child, ii) => {
      if (child) {
        newChildren.push(child);
        newChildren.push(<Cells.Divider key={`divider${ii}`}/>);
      }
    });
    newChildren.pop();
    return <View {...props} style={[CellsStyles.Root, props.style]}>{newChildren}</View>;
  },
  Item: (props) => <View {...props} style={[CellsStyles.Item, props.style]} />,
  Divider: (props) => <View style={CellsStyles.Divider} />,
};
const CellsStyles = StyleSheet.create({
  Root: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  Item: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  Divider: {
    backgroundColor: '#0e4958',
    height: 30,
    marginHorizontal: 10,
    width: 2,
  },
});
