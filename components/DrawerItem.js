import React from "react";
import { StyleSheet } from "react-native";
import { View, Text} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';


import theme from "../constants/Theme";

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Home":
        return (
          <Ionicons
            name="md-home"
            family="ArgonExtra"
            size={22}
            color={focused ? "white" : theme.COLORS.JAPANESE_INDIGO}
          />
        );
        case "Usage History":
        return (
          <Ionicons
            name="md-bicycle"
            family="ArgonExtra"
            size={22}
            color={focused ? "white" : theme.COLORS.JAPANESE_INDIGO}
          />
        );
        case "Notifications":
        return (
          <Ionicons
            name="md-notifications"
            family="ArgonExtra"
            size={22}
            color={focused ? "white" : theme.COLORS.JAPANESE_INDIGO}
          />
        );
        case "Report":
        return (
          <Ionicons
            name="md-alert"
            family="ArgonExtra"
            size={22}
            color={focused ? "white" : theme.COLORS.JAPANESE_INDIGO}
          />
        );
        case "Settings":
        return (
          <Ionicons
            name="md-settings"
            family="ArgonExtra"
            size={22}
            color={focused ? "white" : theme.COLORS.JAPANESE_INDIGO}
          />
        );
        case "Session":
        return (
          <Ionicons
            name="md-time"
            family="ArgonExtra"
            size={22}
            color={focused ? "white" : theme.COLORS.JAPANESE_INDIGO}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { focused, title } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null,
    ];

    return (
      <View style={containerStyles}>
        <View middle style={{ flex:0.1, alignItems:'flex-start', marginRight: 5 }}>
          {this.renderIcon()}
        </View>
        <View style={{flex:0.9}}>
          <Text
            size={15}
            bold={focused ? true : false}
            style= {{color: focused ? "white" : theme.COLORS.JAPANESE_INDIGO, fontWeight: focused ? 'bold' : 'normal'}}
          >
            {title}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    flex:1,
    flexDirection:'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  activeStyle: {
    backgroundColor: theme.COLORS.JAPANESE_INDIGO,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: theme.COLORS.DIAMOND,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
