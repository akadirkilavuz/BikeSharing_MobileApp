import {Text, TextInput, View, Button } from 'react-native';
import React from 'react';

export default class ResetPassword extends React.Component {

    constructor()
    {
      super();
   
      this.state = {  password: "",
                      passwordValid:true,
                      loading: false,
                      disabled: false }                          
    }

    validate(text, type){
        
        pass=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        
        if(type=='password'){
          if(pass.test(text))
          {
            this.setState({
              passwordValid:true,
              password: text,
            })
          }
          else
          {
            this.setState({
              passwordValid:false,
            })
          }
  
        }
      }
  
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start',paddingHorizontal:10, paddingVertical:200, backgroundColor: '#f5fcff'}}>
          <Text style={{height:20, width:300, }}>New Password</Text>
          <TextInput
            placeholder=" Create New Password"
            style={[{height:30, width:200, backgroundColor:"#fff", borderColor:"#000", borderWidth:2, borderRadius:3}, !this.state.passwordValid? {borderWidth:3,borderColor:'red'}:null]}
            onChangeText = {(text) => this.validate(text, 'password')}
            secureTextEntry
          />
          <Text > </Text>
          <Text style={{height:20, width:300 }}>Confirm Password</Text>
          <TextInput
            placeholder=" Repeat Password"
            leftIcon={{ type: 'font-awesome', name: 'chevron-left' }}
            style={{height:30, width:200, backgroundColor:"#fff", borderColor:"#000", borderWidth:2, borderRadius:3}}
            onChangeText = {(text) => this.setState({ password: text })}
            secureTextEntry
          />

          <View style={{backgroundColor:"#508ff0", width:100, padding:0, margin:10, borderWidth:1, borderRadius:3, borderBottomRightRadius:50,borderTopLeftRadius:50 }}>
            <Button 
             color="#fff"
             title="Create"
            onPress={() => this.props.navigation.navigate('Home')}
            />
          </View>
        </View>
      );
    }
}
