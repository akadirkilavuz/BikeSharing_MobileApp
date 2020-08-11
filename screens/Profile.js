import React from 'react';
import { View, TouchableOpacity, TextInput, Text, KeyboardAvoidingView,ScrollView ,StyleSheet} from 'react-native';
import theme from '../constants/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

export default class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state={
            user:{},
            phone:null,
            email:null,
            username:null,
            jwt:null,
        };
    }
    saveData = () => {
        this.setState({ loading: true, disabled: true }, () => {
          fetch('http://35.189.94.121/users/'+this.state.user._id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.state.jwt}`
            },
            body: JSON.stringify({
                phone : this.state.phone,
                email : this.state.email,
                username : this.state.username,
                tcNo : this.state.tcNo,
                name : this.state.user.name,
                surname : this.state.user.surname,
                password : this.state.user.password,
            })
          }).then((response) => response.json()).then((responseJson) => {
                console.log(responseJson)
                if(responseJson.statusCode==400){
                    alert(responseJson.message[0].messages[0].message);
                }
                else alert("Profile was updated successfully.");
                
                this.setState({ loading: false, disabled: false });
            }).catch((error) => {
                console.error(error);
                this.setState({ loading: false, disabled: false });
              });
        });
      }

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

    async UNSAFE_componentWillMount(){
        user = await this._retrieveData('user');
        userjsoned = JSON.parse(user);
        this.setState({jwt:userjsoned.jwt})
        this.setState({user:userjsoned.user})
        this.setState({
            phone : this.state.user.phone,
            email : this.state.user.email,
            username : this.state.user.username,
        })
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor:theme.COLORS.SEASHELL}}>
                <View style={{backgroundColor:theme.COLORS.DIAMOND, height:120}}>
                <TouchableOpacity style={{alignItems:'center', justifyContent:'center', margin:10, width:50, height:50,
                    borderRadius:25, marginTop:30, backgroundColor:theme.COLORS.JAPANESE_INDIGO}} 
                    onPress= {() => this.props.navigation.toggleDrawer()}>
                    <Ionicons name="md-menu" color={theme.COLORS.SEASHELL} size={35}/>
                </TouchableOpacity>
                <View style={{alignItems:'center'}}>
                    <Ionicons name="md-contact" size={150} style={{color:theme.COLORS.LAPIS_LAZULI}} />
                </View>
                </View>
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={-500}>
                <ScrollView 
                    style={{flex:1, marginHorizontal:40, marginTop:130}}>
                    <Text 
                        style={styles.textStyle}>T.C. number </Text>
                    <TextInput 
                        style={styles.textInputStyle} 
                        value={this.state.user.tcNo} 
                        editable={false}/>
                    <Text 
                        style={styles.textStyle}>Name </Text>
                    <TextInput 
                        style={styles.textInputStyle} 
                        value={this.state.user.name} 
                        editable={false}/>
                    <Text 
                        style={styles.textStyle}>Surname </Text>
                    <TextInput 
                        style={styles.textInputStyle} 
                        value={this.state.user.surname} 
                        editable={false}/>
                    <Text 
                        style={styles.textStyle}>Username </Text>
                    <TextInput 
                        style={styles.textInputStyle} 
                        placeholder={this.state.user.username}
                        onChangeText = {(text) => this.setState({ username: text })}/>
                    <Text 
                        style={styles.textStyle}>E-mail </Text>
                    <TextInput 
                        style={styles.textInputStyle} 
                        placeholder={this.state.user.email}
                        onChangeText = {(text) => this.setState({ email: text })}/>
                    <Text 
                        style={styles.textStyle}>Phone </Text>
                    <TextInput 
                        style={styles.textInputStyle} 
                        placeholder={this.state.user.phone}
                        onChangeText = {(text) => this.setState({ phone: text })}
                        />
                    <TouchableOpacity onPress={this.saveData}
                        style={{
                            marginHorizontal:70, 
                            marginVertical:30, 
                            alignItems:'center', 
                            backgroundColor:theme.COLORS.JAPANESE_INDIGO,
                            
                            }}
                            
                            >
                        <Text style={{color:theme.COLORS.SEASHELL, padding:5, fontWeight:'bold'}}>SAVE</Text>
                    </TouchableOpacity>
                </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    textStyle:{
        marginBottom:5, 
        color:theme.COLORS.JAPANESE_INDIGO
    },
    textInputStyle:{
        borderWidth:1, 
        borderRadius:3, 
        borderColor:theme.COLORS.JAPANESE_INDIGO,
        backgroundColor:"white", 
        marginBottom:5, 
        paddingLeft:5
    }
  })