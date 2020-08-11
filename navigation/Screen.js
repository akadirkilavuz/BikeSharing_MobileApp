import React from "react";
import { Easing, Animated, View, Text, StyleSheet} from "react-native";
import {createAppContainer} from "react-navigation";
import {createDrawerNavigator} from 'react-navigation-drawer';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import theme from "../constants/Theme";
import Ionicons from 'react-native-vector-icons/Ionicons';

// screens
import Login from "../screens/Login";
import Session from "../screens/active_home_screens/Session";
import Balance from "../screens/home_screens/Balance";
import Balance2 from "../screens/active_home_screens/Balance";
import Dockers from "../screens/home_screens/Dockers";
import Dockers2 from "../screens/active_home_screens/Dockers";
import QRScanner from "../screens/home_screens/QRScanner";
import SignUp from '../screens/SignUp';
import RecoveryPassword from '../screens/RecoveryPassword';
import ResetPassword from '../screens/ResetPassword';
import Usages from '../screens/Usages';
import Transactions from '../screens/Transactions';
import Notifications from '../screens/Notifications';
import Report from '../screens/Report';
import Settings from "../screens/Settings";
import Profile from "../screens/Profile";

// drawer
import Menu from "./Menu";
import DrawerItem from "../components/DrawerItem";

  _retrieveData = async (dataContainer) => { // takes string input
    try {
      const value = await AsyncStorage.getItem(dataContainer);
      return value;
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  const HomeStack = createBottomTabNavigator(
    {
      Balance: {screen: Balance},
      Scan: {screen: QRScanner},
      Dockers: {screen: Dockers}
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          let size;
          if (routeName === 'Balance') {
            iconName = 'md-wallet';
            size = 40;
          }
          else if (routeName === 'Scan') {
            iconName = 'md-qr-scanner';
            size = 40;
          }
          else if (routeName === 'Dockers') {
            iconName = 'md-pin';
            size = 40;
          }
          return <Ionicons name={iconName} size={size} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeBackgroundColor:theme.COLORS.JAPANESE_INDIGO,
        inactiveBackgroundColor: theme.COLORS.SEASHELL,
        tabStyle:{marginLeft:10, marginRight:10, marginBottom:5, marginTop:5, borderRadius:10},
        activeTintColor: theme.COLORS.SEASHELL,
        inactiveTintColor: theme.COLORS.JAPANESE_INDIGO,
        style: {height:80, borderTopColor:theme.COLORS.SEASHELL, backgroundColor:theme.COLORS.SEASHELL},
      },
    }
  );
  
  const SessionStack = createBottomTabNavigator(
    {
      Balance: {screen: Balance2},
      Session: {screen: Session},
      Dockers: {screen: Dockers2}
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          let size;
          if (routeName === 'Balance') {
            iconName = 'md-wallet';
            size = 40;
          }
          else if (routeName === 'Session') {
            iconName = 'md-time';
            size = 40;
          }
          else if (routeName === 'Dockers') {
            iconName = 'md-pin';
            size = 40;
          }
          return <Ionicons name={iconName} size={size} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeBackgroundColor:theme.COLORS.JAPANESE_INDIGO,
        inactiveBackgroundColor: theme.COLORS.SEASHELL,
        tabStyle:{marginLeft:10, marginRight:10, marginBottom:5, marginTop:5, borderRadius:10},
        activeTintColor: theme.COLORS.SEASHELL,
        inactiveTintColor: theme.COLORS.JAPANESE_INDIGO,
        style: {height:80, borderTopColor:theme.COLORS.SEASHELL, backgroundColor:theme.COLORS.SEASHELL},
      },
      initialRouteName: "Session"
    }
  );
/*
  const UsageHistoryStack = createMaterialTopTabNavigator(
    {
      Usages: {screen: Usages},
      Transactions: {screen: Transactions}
    },
    {
      defaultNavigationOptions: ({navigation}) => ({
        tabBarLabel: ({focused}) => {
          const { routeName } = navigation.state;
          return <Text style={{color:theme.COLORS.JAPANESE_INDIGO }}> 
                    {routeName}
                  </Text>
        }
      }),
      tabBarOptions: {
        style: {justifyContent:'flex-end', height:80, backgroundColor:theme.COLORS.SEASHELL},
        indicatorStyle: {backgroundColor: theme.COLORS.JAPANESE_INDIGO, height:5}
      },
    }
  );
*/

const UsageHistoryStack = createBottomTabNavigator(
  {
    Usages: {screen: Usages},
    Transactions: {screen: Transactions}
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarLabel: ({focused}) => {
        const { routeName } = navigation.state;
        return <Text style={{color:theme.COLORS.JAPANESE_INDIGO, fontWeight: focused? "bold":"normal", fontSize:16}}> 
                  {routeName}
                </Text>
      }
    }),
    tabBarOptions: {
      style: {height:60, backgroundColor:theme.COLORS.SEASHELL},
      tabStyle: {alignItems:'center', paddingBottom:20, borderTopColor:theme.COLORS.JAPANESE_INDIGO, borderTopWidth:1},
    },
  }
);

const AppStack = createDrawerNavigator(
    {
      Login: {
        screen: Login,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            null
          ),
          drawerLockMode: "locked-closed"
        }),
      },
      Home: {
        screen: HomeStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} title="Home" />
          )
        })
      },
      Session: {
        screen: SessionStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} title="Session" />
          )
        })
      },
      UsageHistory: {
        screen: UsageHistoryStack,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} title="Usage History" />
          )
        })
      },
      Notifications: {
        screen: Notifications,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} title="Notifications" />
          )
        })
      },
      Report: {
        screen: Report,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} title="Report" />
          )
        })
      },
      Settings: {
        screen: Settings,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} title="Settings" />
          )
        })
      },
      SignUp: {
        screen: SignUp,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            null
          ),
          drawerLockMode: "locked-closed"
        })
      },
      Recovery: {
        screen: RecoveryPassword,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            null
          ),
          drawerLockMode: "locked-closed"
        })
      },
      Reset: {
        screen: ResetPassword,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            null
          ),
          drawerLockMode: "locked-closed"
        })
      },
      QRScanner: {
        screen: QRScanner,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            null
          ),
          drawerLockMode: "locked-closed"
        })
      },
      Profile: {
        screen: Profile,
        navigationOptions: navOpt => ({
          drawerLabel: ({ focused }) => (
            null
          ),
        })
      },
    },
    Menu
  );
  
  const AppContainer = createAppContainer(AppStack);
  export default AppContainer;
  