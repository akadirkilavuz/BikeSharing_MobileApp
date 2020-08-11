import React, { Fragment, Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import Mailer from 'react-native-mail';
import {
    View, 
    TouchableOpacity, 
    TextInput, 
    Text, 
    ScrollView, 
    KeyboardAvoidingView,
    StyleSheet,
    Image,
    Button,
    Dimensions,
    Platform,
    PermissionsAndroid

} from 'react-native';
import theme from '../constants/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
const createFormData = (photo) => {
  const data = new FormData();
  data.append('files',photo);
  //console.log(data);
  return data;
};

export default class Report extends React.Component{
    constructor(props){
        super(props);
        this.state={
            title:null,
            description:null,
            image:null,
            user:null,
            position:null,
            uploadedId:null,
            jwt:null,
            hasCameraPermission1:false,
            hasCameraPermission2:false,
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

  _retrieveData = async (data) => { // takes string input
    try {
      const value = await AsyncStorage.getItem(data);
      return value;
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };
  saveData = () => {
    if(this.state.title==null){
      alert("Title cannot be empty.")
      return
    }
    else if (this.state.description==null){
      alert("Description cannot be empty.")
      return
    }
    this.setState({ loading: true, disabled: true }, () => {
      fetch('http://35.189.94.121/reports', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.state.jwt}`
        },
        
        body:JSON.stringify({
          userId:this.state.user._id,
          userLocation:{
            latitude:this.state.position.latitude,
            longitude:this.state.position.longitude
          },
          title:this.state.title,
          description:this.state.description,
      })
      }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson)
      
            alert("Report Sent Successfully.");
            this.props.navigation.navigate('Balance');
            
            this.setState({ loading: false, disabled: false });
        }).catch((error) => {
            console.error(error);
            this.setState({ loading: false, disabled: false });
          });
    });
  }

   async UNSAFE_componentWillMount(){
     var position = null;
     var currentUser = null;
    currentUser =  await this._retrieveData('user');
    position =  await this._retrieveData('position');
    if(currentUser != null){
        currentUser = JSON.parse(currentUser);
        this.setState({jwt:currentUser.jwt});
        this.setState({user:currentUser.user});
    }
    else{
        alert("User authentication failed.");
    }
    position = JSON.parse(position);
    console.log(position)
    if(position != null){
       
       this.setState({position:position});
    }
    else{
      alert("Location Not Found.")
      
    }
  }

  handleEmail = () => {
    if(this.state.title==null){
      alert("Title cannot be empty.")
      return
    }
    else if (this.state.description==null){
      alert("Description cannot be empty.")
      return
    }
    else if (this.state.image==null){
      alert("You have to select an image.")
      return
    }
    var report = 'Report: ';
    Mailer.mail({
      subject: report.concat(this.state.title),
      recipients: ['bikesharing.sender@gmail.com'],
      body: this.state.description,
      isHTML: true,
      attachment: {
        path: this.state.image.path,  // The absolute path of the file from which to read data.
        type: this.state.image.type,   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
        name: 'Photo',   // Optional: Custom filename for attachment
      }
    }, (error, event) => {
      Alert.alert(
        error,
        event,
        [
          {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
          {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
        ],
        { cancelable: true }
      )
    });
    this.textInput.clear()
    this.textInput2.clear()
    this.setState({title:null,description:null,image:null})
    
  }
    async componentDidMount() {
      const granted1 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted1) {
          this.setState({hasCameraPermission1:true});
        }
        else{
          alert('Sorry, we need external storage permissions to make this work!');
        }
        const granted2 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if(granted2){
          this.setState({hasCameraPermission2:true});
        }
        else{
          alert("CAMERA permission denied")
        }
    }


    _pickImage = () => {
      if(this.state.hasCameraPermission1 & this.state.hasCameraPermission2){
        var options = {
          title: 'Select Image',
          customButtons: [
            { 
              name: 'customOptionKey', 
              title: 'Choose file from Custom Option' 
            },
          ],
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
         ImagePicker.showImagePicker(options, res  =>  {
            const granted1 = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted1) {
              this.setState({hasCameraPermission1:true});
            }
            else{
              alert('Sorry, we need external storage permissions to make this work!');
            }
            const granted2 = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if(granted2){
              this.setState({hasCameraPermission2:true});
            }
            else{
              alert("CAMERA permission denied")
            }
            if (res.didCancel) {
              console.log('User cancelled image picker');
            } else if (res.error) {
              console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
              console.log('User tapped custom button: ', res.customButton);
              alert(res.customButton);
            } else {
              let source = res;
              this.setState({
                image: source,
              });
            }
          });
          
      }
      
    };
    render(){
      let { image } = this.state;
        return(
            <View 
                style={{flex:1, backgroundColor:theme.COLORS.SEASHELL}}>
                <TouchableOpacity 
                    style={{alignItems:'center', justifyContent:'center', margin:10, width:50, height:50,
                    borderRadius:25, marginTop:30, backgroundColor:theme.COLORS.JAPANESE_INDIGO}} 
                    onPress= {() => this.props.navigation.toggleDrawer()}>
                    <Ionicons name="md-menu" color={theme.COLORS.SEASHELL} size={35}/>
                </TouchableOpacity>
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={-500}>
                <ScrollView>
                <View style={{flex:1, justifyContent:'center', margin:20}}>
                    <Text 
                        style={{marginLeft:5, marginBottom:5, color:theme.COLORS.JAPANESE_INDIGO}}>Title :</Text>
                    <TextInput 
                        style={{
                            borderWidth:1, 
                            borderRadius:3, 
                            borderColor:theme.COLORS.JAPANESE_INDIGO, 
                            backgroundColor:"white", 
                            marginBottom:5, 
                            paddingLeft:5}}
                            onChangeText = {(text) => this.setState({ title: text })}
                            ref={input => { this.textInput = input }}
                            />
                    <Text 
                        style={{marginLeft:5, marginBottom:5, color:theme.COLORS.JAPANESE_INDIGO}}>Description :</Text>
                    <TextInput 
                        style={{
                            borderWidth:1, 
                            borderRadius:3, 
                            borderColor:theme.COLORS.JAPANESE_INDIGO, 
                            backgroundColor:"white", 
                            marginBottom:5, 
                            paddingTop:5,
                            paddingLeft:5}} 
                            numberOfLines={8} 
                            textAlignVertical={"top"}
                            onChangeText = {(text) => this.setState({ description: text })}
                            ref={input => { this.textInput2 = input }}
                        />
                    <TouchableOpacity onPress={this.saveData}
                        style={{marginVertical:40, marginHorizontal:60, backgroundColor:theme.COLORS.JAPANESE_INDIGO,
                            flexDirection:"row", alignItems:'center', justifyContent:'center', height:40}}>
                        <Text style={{fontWeight:'bold', fontSize:16, color:"white"}}>SEND</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    scrollView: {
      
    },
  
    body: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      borderColor: 'black',
      borderWidth: 1,
      height: Dimensions.get('screen').height - 20,
      width: Dimensions.get('screen').width
    },
    btnSection: {
      width: 100,
      height: 50,
      backgroundColor: '#DCDCDC',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 3,
      marginBottom:10,
      marginTop:10,
      marginLeft:10
    },
    btnText: {
      textAlign: 'center',
      color: 'gray',
      fontSize: 14,
      fontWeight:'bold'
    }
  });