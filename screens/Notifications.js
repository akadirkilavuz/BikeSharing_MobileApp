import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import theme from '../constants/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Notifications extends React.Component{
    render(){
        return(
            <View style={{flex:1, backgroundColor:theme.COLORS.SEASHELL}}>
                <TouchableOpacity style={{alignItems:'center', justifyContent:'center', margin:10, width:50, height:50,
                    borderRadius:25, marginTop:30, backgroundColor:theme.COLORS.JAPANESE_INDIGO}} 
                    onPress= {() => this.props.navigation.toggleDrawer()}>
                    <Ionicons name="md-menu" color={theme.COLORS.SEASHELL} size={35}/>
                </TouchableOpacity>
            </View>
        );
    }
};