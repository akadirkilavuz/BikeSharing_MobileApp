import {StyleSheet,Text, TextInput, View, Button, KeyboardAvoidingView,ScrollView ,Image} from 'react-native';
import React from 'react';
import theme from '../constants/Theme';

export default class SignUp extends React.Component {

  constructor(){
        super();
        this.state = {  username: "", 
                        password: "",
                        tcNo: "",
                        name: "",
                        surname: "",
                        phone: "",
                        eMail: "",
                        birthDate: "",
                        loading: false,
                        disabled: false ,
                        passwordValid:true,
                        birthDateValid:true,
                        phoneValid:true,
                        tcValid:true,
                        eMailValid:true,

                      }
  }
  
  
  saveData = () => {
    this.setState({ loading: true, disabled: true }, () => {
      fetch('http://35.189.94.121/users/register', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tcNo : this.state.tcNo,
            name : this.state.name,
            surname : this.state.surname,
            phone : this.state.phone,
            eMail : this.state.eMail,
            userName : this.state.username,
            password : this.state.password,
            birthDate : this.state.birthDate
        })
      }).then((response) => response.json()).then((responseJson) => {
            alert(responseJson);
            this.setState({ loading: false, disabled: false });
        }).catch((error) => {
            console.error(error);
            this.setState({ loading: false, disabled: false });
          });
    });
  }

  validate(text, type){

    birthday=/^\d{1,2}\/\d{1,2}\/\d{4}$/
    email=/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/
    tc=/^\d{11}$/
    pass=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

    phone=/^\(?[\d]{3}\)?[\s-]?[\d]{3}[\s-]?[\d]{4}$/

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

    else if(type=='phone'){
      if(phone.test(text))
      {
        this.setState({
          phoneValid:true,
          phone: text,
        })
      }
      else
      {
        this.setState({
          phoneValid:false,
        })
      }

    }

    else if(type=='tc'){
      if(tc.test(text))
      {
        this.setState({
          tcValid:true,
          tcNo: text,
        })
      }
      else
      {
        this.setState({
          tcValid:false,
        })
      }

    }

    else if(type=='email'){
      if(email.test(text))
      {
        this.setState({
          eMailValid:true,
          eMail: text,
        })
      }
      else
      {
        this.setState({
          eMailValid:false,
        })
      }

    }

    else if(type=='birthday'){
      if(birthday.test(text))
      {
        this.setState({
          birthDateValid:true,
          birthDate: text,
        })
      }
      else
      {
        this.setState({
          birthDateValid:false,
        })
      }

    }
  }  
  
  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={-500}>
         <ScrollView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor: theme.COLORS.SEASHELL}}>
        <Image
          style={{width:300, height:60, marginBottom:40, marginTop:70}}
          source={require("../assets/images/logo.png")} />
    
        <TextInput 
          textAlignVertical="center"
          placeholder="  Username"
          style={styles.textInputStyle}
          onChangeText = {(text) => this.setState({ username: text })}
        />
  
        <TextInput
          placeholder="  Password"
          style={[styles.textInputStyle, !this.state.passwordValid? {borderWidth:3,borderColor:'red'}:null]}
          onChangeText = {(text) => this.validate(text, 'password')}
          secureTextEntry
        />
     
        <TextInput
          placeholder="  Repeat Password"
          leftIcon={{ type: 'font-awesome', name: 'chevron-left' }}
          style={styles.textInputStyle}
          onChangeText = {(text) => this.setState({ password: text })}
          secureTextEntry
        />
        
        <TextInput
          placeholder="  T.C.  eg:XXXXXXXXXXX"
          style={[styles.textInputStyle, !this.state.tcValid? {borderWidth:3,borderColor:'red'}:null]}
          onChangeText = {(text) => this.validate(text, 'tc')}
        />
       
        <TextInput
          placeholder="  Name"
          style={styles.textInputStyle}
          onChangeText = {(text) => this.setState({ name: text })}
        />
       
        <TextInput
          placeholder="  Surname"
          style={styles.textInputStyle}
          onChangeText = {(text) => this.setState({ surname: text })}
        />
        
        <TextInput
          placeholder="  Phone eg:(xxx)xxxxxxx"
          style={[styles.textInputStyle, !this.state.phoneValid? {borderWidth:3,borderColor:'red'}:null]}
          onChangeText = {(text) => this.validate(text, 'phone')}
        />
        
        <TextInput
          placeholder="  Email example@bikesharing.com"
          style={[styles.textInputStyle, !this.state.eMailValid? {borderWidth:3,borderColor:'red'}:null]}
          onChangeText = {(text) => this.validate(text, 'email')}
        />
        
        <TextInput
          
          placeholder="  Birthday DD/MM/YYYY"
          style={[styles.textInputStyle, !this.state.birthDateValid? {borderWidth:3,borderColor:'red'}:null]}
          onChangeText = {(text) => this.validate(text, 'birthday')}
        />
       
        <Button title="Sign Up"
          onPress = { this.saveData }
        />
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  textInputStyle:{
    height:40, 
    width:250, 
    borderColor:"#000", 
    borderRadius:14,
    borderWidth:0,
    backgroundColor:'#fff',
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    },
    margin:5,
    padding:10,
    fontSize:14

  }
})