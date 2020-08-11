import { StyleSheet, Text, TextInput, View, Image ,Button,TouchableOpacity} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../constants/Theme';
import AsyncStorage from '@react-native-community/async-storage';


export default class Login extends React.Component {

  constructor(){
    super();
    this.state = {  identifier: "", 
                    password: "",
                    responseMessage:" ",
                    user: null,
                    session: null,
                    loading: false,
                    disabled: false,
                  }
  }

  _storeData = async (dataContainer, data) => { //both parameters are string.
    try {
      await AsyncStorage.setItem(dataContainer, data);
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };

  _retrieveData = async (dataContainer) => { // takes string input
    try {
      const value = await AsyncStorage.getItem(dataContainer);
      if (value != null){
        return value;
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  authUser = () => {
    this.setState({ loading: true, disabled: true }, () => {
      fetch('http://35.189.94.121/auth/local', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier : this.state.identifier,
            password : this.state.password
        })
      }).then((response) => response.json()).then(async (responseJson) => {
            this.setState({ loading: false, disabled: false });
            if ( "error" in responseJson ){
              this.setState({responseMessage:"Wrong username/email or password!"});
            }
            else{
              this.setState({user:responseJson});
              this._storeData("user", JSON.stringify(responseJson));
              var jwt = responseJson.jwt;
              var openSession = await this.getSession(jwt);
              this.setState({session:openSession});
              this._storeData("session", JSON.stringify(openSession));
              
              this.navigate();
            }
        }).catch((error) => {
            console.error(error);
            this.setState({ loading: false, disabled: false });
          });
    });
  }

  navigate(){
    if(this.state.session == null ){
      this.props.navigation.navigate('Home');
    }
    else{
      this.props.navigation.navigate('Session');
    }
  }

  getSession = async (jwt) => {
    return new Promise((resolve) => {
    this.setState({ loading: true, disabled: true }, async () => {
      await fetch('http://35.189.94.121/usages/openSession/', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
      }).then((response) => response.json()).then(async (responseJson) => {
            this.setState({ loading: false, disabled: false });
            if ( responseJson.status === 200 ){
              resolve(responseJson.data);
            }
            else{
              resolve(null);
            }
        }).catch((error) => {
            console.error(error);
            this.setState({ loading: false, disabled: false });
          });
    });
  })}
  
  async UNSAFE_componentWillMount(){
    user = await this._retrieveData('user');
    if(user != null){
      if(this.state.session == null ){
        this.props.navigation.navigate('Home');
      }
      else{
        this.props.navigation.navigate('Session');
      }
    }
    else{
      
    }
  }

  render(){
    return (
      <View style={styles.container}>
        <Image
          style={{width:326, height:60, marginBottom:40, marginTop:70}}
          source={require("../assets/images/logo.png")} />
        <Text style={{color:'red', marginBottom:5}}>{this.state.responseMessage}</Text>
        <View style={{flexDirection:'row', alignItems:'center', marginBottom:10,}}>
          <View style={{alignItems:'center', justifyContent:'center', backgroundColor:theme.COLORS.DIAMOND, width:40, height:40}}>
            <Ionicons name='md-person' size={26} color={theme.COLORS.JAPANESE_INDIGO}/>
          </View>
          <TextInput 
            style={{height:40, width:200, backgroundColor:"#fff", paddingLeft:7, color:theme.COLORS.JAPANESE_INDIGO}}
            onChangeText = {(text) => this.setState({ identifier: text })}
            placeholder = "username or e-mail"
          />
        </View>
        <View style={{flexDirection:'row', alignItems:'center', marginBottom:35}}>
          <View style={{alignItems:'center', justifyContent:'center', backgroundColor:theme.COLORS.DIAMOND, width:40, height:40}}>
            <Ionicons name='md-lock' size={26} color={theme.COLORS.JAPANESE_INDIGO}/>
          </View>
          <TextInput
            style={{height:40, width:200, backgroundColor:"#fff", paddingLeft:7, color:theme.COLORS.JAPANESE_INDIGO}}
            onChangeText = {(text) => this.setState({ password: text })}
            placeholder = "password"
            secureTextEntry
          />
        </View>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity
            style={{backgroundColor:theme.COLORS.DIAMOND, justifyContent:'center', width:110, height:40, padding:5, margin:10, }}
            onPress={ this.authUser /*this.props.navigation.navigate('Home')*/}
          >
            <Text style={{textAlign:"center", fontWeight:"700", color:theme.COLORS.JAPANESE_INDIGO}}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{backgroundColor:theme.COLORS.DIAMOND, justifyContent:'center', width:110, height:40, padding:5, margin:10, }}
            onPress={() => this.props.navigation.navigate('SignUp')}
          >
            <Text style={{textAlign:"center", fontWeight:"700", color:theme.COLORS.JAPANESE_INDIGO}}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={ () => this.props.navigation.navigate('Recovery') }>
          <Text 
            style={{marginTop:20, color:theme.COLORS.JAPANESE_INDIGO}}
            >Did you forget your password?
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

    
const styles = StyleSheet.create({
    container: {
      flex:1,
      flexDirection:'column',
      backgroundColor: theme.COLORS.SEASHELL,
      alignItems: 'center',
      justifyContent: 'center',
    },
});