import {Text, TextInput, View, Button } from 'react-native';
import React from 'react';

export default class RecoveryPassword extends React.Component {

    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingVertical:100, backgroundColor: '#f5fcff'}}>
          <Text style={{height:70, width:350, backgroundColor:"#f5fcff", fontSize:23, fontWeight:'bold',justifyContent: 'space-around'}}>
            Find your BikeSharing account </Text>

          <Text style={{height:30, width:300, backgroundColor:"#f5fcff", fontSize:18}}>
           Enter your email </Text>
          <TextInput 
            style={{height:30, width:300, backgroundColor:"#fff", borderColor:"#000", borderWidth:2,borderRadius:30}}
            onChangeText = {(text) => this.setState({ username: text })}
          />

          <View style={{backgroundColor:"#508ff0", width:100, padding:0, margin:10, borderWidth:2, borderRadius:30,borderColor: '#508ff0' }}>
            <Button 
             color="#fff"
             title="Search"
            onPress={() => this.props.navigation.navigate('Reset')}
            />
          </View>
         
          
        </View>
      );
    }
}
