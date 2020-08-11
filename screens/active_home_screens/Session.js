/*endSession = () => {
        
  console.log(this.state.coords);
   this.setState({ loading: true, disabled: true }, () => {
     fetch('http://35.189.94.121/usages/endSession', {
       method: 'POST',
       headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
           Authorization: `Bearer ${this.state.jwt}`
       },
       body: JSON.stringify({
           userId : this.state.user.user._id,
           location : [this.state.position.longitude,this.state.position.latitude],
           coords: this.state.coords.points,
       })
     }).then((response) => response.json()).then((responseJson) => {
           this.setState({ loading: false, disabled: false });
           if(responseJson.status === 200){                      
               alert('Total payment is : ' + responseJson.data.totalPaid.toFixed(2) + ' ₺.')
               user = {
                 user : responseJson.data.user,
                 jwt : this.state.jwt
               }
               var a = {
                       points:[],
                    }
               this.setState({coords:a})
               this._storeData("user", JSON.stringify(user));
               this._removeItem("session")
               user =  this._retrieveData('user');
               user = JSON.parse(user);
               user.user.balance = newbalance;
               this._storeData('user',JSON.stringify(user));
               this.setState({reset:false});
               this.resetStopwatch();
               this.toggleStopwatch();
               this.setState({isOp:false});
               this.props.navigation.navigate("Home");                 
           }
           else{
               alert(responseJson.message)
           }
       }).catch((error) => {
           console.error(error);
           this.setState({ loading: false, disabled: false });
         });
   });
 }*/

 import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Stopwatch } from 'react-native-stopwatch-timer';
import theme from '../../constants/Theme';
import ToggleSwitch from 'rn-toggle-switch'
import AsyncStorage from '@react-native-community/async-storage';
import PubNub from 'pubnub';
import Geolocation from 'react-native-geolocation-service';
var id;
export default class Session extends React.Component{

    constructor(props) {
        
        super(props);
        this.pubnub = new PubNub({
          publishKey: "pub-c-e931fca2-2897-4f6c-a318-247ab6b7fd49",
          subscribeKey: "sub-c-79fca6d4-9613-11ea-9e4d-221e1ff586d3",
          uuid:"1234123"
        });
        this.state = {
          stopwatchStart: false,
          stopwatchReset: false,
          amount: 0,
          dene:false,
          sessionStartTime: new Date(),
          stopwatchStartTime: 0,
          reset: false,
          session: null,
          user: null,
          isLocked: true,
          isOK: false,
          position:{
            latitude:0,
            longitude:0,
            latitudeDelta:0,
            longitudeDelta:0,
          },
          jwt:null,
          coords:{
            points:[],
          },
          isOp:false
        };
        this.resetStopwatch = this.resetStopwatch.bind(this);
        this.toggleStopwatch = this.toggleStopwatch.bind(this);


    }

    formatDate (date) {
        var datestring = 
            " " 
            + ("0" + date.getDate()).slice(-2)  + "/" 
            + ("0" + (date.getMonth() + 1)).slice(-2)+ "/" 
            + date.getFullYear() + " " 
            + ("0" + date.getHours()).slice(-2) + ":" 
            + ("0" + date.getMinutes()).slice(-2);
            return datestring;
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
            if(value !== null)
             {return value;}
            else
             {return null;}

        } catch (error) {
          // Error retrieving data
          console.log(error);
        }
      };
      _removeItem = async (dataContainer) => { //both parameters are string.
        try {
          await AsyncStorage.removeItem(dataContainer);
        } catch (error) {
          // Error saving data
          console.log(error);
        }
      };

      getSessionStartTime = async () => {
        try{
            this.setState({sessionStartTime: new Date(this.state.session.createdAt)});
            this.getAmount();
        }catch(err){
            console.error(err);
        }
      }

      endSession = async () => {    
       console.log(this.state.coords);
        this.setState({ loading: true, disabled: true }, () => {
          fetch('http://35.189.94.121/usages/endSession', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.state.jwt}`
            },
            body: JSON.stringify({
                userId : this.state.user.user._id,
                location : [this.state.position.longitude,this.state.position.latitude],
                coords: this.state.coords.points,
            })
          }).then((response) => response.json()).then((responseJson) => {
                this.setState({ loading: false, disabled: false });
                if(responseJson.status === 200){                      
                    alert('Total payment is : ' + responseJson.data.totalPaid.toFixed(2) + ' ₺.')
                   
                    this.resetStopwatch;
                    this.toggleStopwatch;
                    user = {
                      user : responseJson.data.user,
                      jwt : this.state.jwt
                    }
                    var a = {
                            points:[],
                         }
                    this.setState({isWatchOK:false})
                    this.setState({session:null});
                    this.setState({coords:a})
                    this.setState({stopwatchStartTime:0});
                    this.setState({amount:0});
                    clearInterval(this.interval);
                    this._storeData("user", JSON.stringify(user));
                    this._removeItem("session")
                    this.props.navigation.navigate("Home");                 
                }
                else{
                    alert(responseJson.message)
                }
            }).catch((error) => {
                console.error(error);
                this.setState({ loading: false, disabled: false });
              });
        });
      }

      async getLockStatus(){
        
        this.setState({ loading: true, disabled: true }, () => {
            fetch('http://35.189.94.121/bikes/' + this.state.session.bikeId, {
              method: 'GET',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.state.jwt}`
              }
            }).then((response) => response.json()).then( async (responseJson) => {
                  this.setState({ loading: false, disabled: false });
                  
                  if ("error" in responseJson){
                    alert(responseJson.message);
                  }
                  else{
                      this.setState({isLocked:responseJson.isLocked, isOK:true});
                      console.log("1-"+this.state.isLocked);
                      console.log("2-"+responseJson.isLocked);  
                  }
              }).catch((error) => {
                  console.error(error);
                  this.setState({ loading: false, disabled: false });
                });
          });
          return true;
      }

      changeLockState(){
        this.setState({ loading: true, disabled: true }, () => {
            fetch('http://35.189.94.121/bikes/changeLockState', {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.state.jwt}`
              },
              body: JSON.stringify({
                  bikeId : this.state.session.bikeId
              })
            }).then((response) => response.json()).then((responseJson) => {
                    
                this.setState({ loading: false, disabled: false });
                //alert(responseJson.message)
                  
              }).catch((error) => {
                  console.error(error);
                  this.setState({ loading: false, disabled: false });
                });
          });
      }

    
    async getAmount() {
        let diff = new Date() - this.state.sessionStartTime;
        this.setState({stopwatchStartTime:diff});
        this.setState({isWatchOK: true})
        diff = diff/60000.0;
        let totalPayment = 15;
        /*if(diff>5){
            totalPayment += 5.0
        }
        if(diff>60){
            totalPayment += (diff-60)*0.1;
        }
        if(diff>1440){
            totalPayment += (diff-1440)*0.4;
        }*/
        totalPayment += (diff)*0.1;
        this.setState({amount:totalPayment});
    }
    async UNSAFE_componentWillMount() {
      var currentSession = null;
      var currentUser = null;
      var position = null;
      currentUser = await this._retrieveData('user');
      currentSession = await this._retrieveData('session');
      position = await this._retrieveData('position');
      currentSession = JSON.parse(currentSession);
      if(currentSession === "null" || currentSession === null){
       alert("You do not have any open session");
         this.props.navigation.navigate('Home');
      }

      else{
          
          currentUser = JSON.parse(currentUser);
          this.setState({user:currentUser})
          this.setState({jwt:currentUser.jwt})
          this.setState({session:currentSession})
          this.getSessionStartTime();
          this.getLockStatus();
  
      }
      position = JSON.parse(position);
      if(position != null){
        this.setState({position:position});
        this.setState({
          coords:{
            points:[
              [position.longitude,position.latitude],
              ...this.state.coords.points  
          ]
          }
            
        })
     }
     else{
       alert("Please Click The Zones Page");
     }
  }
  /*componentDidUpdate(prevProps){
    if(prevProps.session === null && this.state.session !== null){
      this.setState({isWatchOK:true})
    }
  }*/
  async componentDidMount (){
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => { 
      var currentUser = null;
    var session = null;
    var sessionJsoned = null;
    currentUser = await this._retrieveData('user');
    currentUser = JSON.parse(currentUser);
    this.setState({user:currentUser})
    this.setState({jwt:currentUser.jwt})
    session = await this._retrieveData('session');
    
    sessionJsoned = JSON.parse(session);
    
    if(sessionJsoned === "null" || sessionJsoned === null){
      alert("You do not have any open session");
      this.props.navigation.navigate("Home");
    }
    else{
      this.setState({session : sessionJsoned});
      this.setState({sessionStartTime: new Date(this.state.session.createdAt)});
      this.resetStopwatch;
      this.toggleStopwatch;
      this.setUpApp();
      this.interval = setInterval(() => {this.getAmount() }, 10000); 
      
    }
    })
  }
  async setUpApp(){
    let pos  = [];
      Geolocation.watchPosition((position) => {
        pos = [position.coords.longitude,position.coords.latitude];
        console.log(pos);
        this.pubnub.publish({
          message:{
            coords:[position.coords.longitude,position.coords.latitude]
          },
          channel:"gpstrack",
          sendByPost: false,
          storeinHistory:false
        })
        
        this.setState({
          coords:{
            points:[
              ...this.state.coords.points,
              pos
          ]
          }
            
        })
        }, (error) => {
        alert(JSON.stringify(error.message))
         }, {
          distanceFilter:1,
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000
        });
    
     
  }
      componentWillUnmount(){
        this.focusListener.remove();
        clearInterval(this.interval);
      
        
      }

    resetStopwatch() {
        this.setState({stopwatchStart: false, stopwatchReset: true});
      }

      toggleStopwatch() {
        this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
      }

    
    render () {
        
        return(
            
            <View style={styles.container}>
                <View style={{alignSelf:'stretch', marginTop:30}}>
                    <TouchableOpacity style={{alignItems:'center', justifyContent:'center', marginLeft:10, width:50, height:50,
                        borderRadius:25, backgroundColor:theme.COLORS.JAPANESE_INDIGO}} 
                        onPress= {() => this.props.navigation.toggleDrawer()}>
                        <Ionicons name="md-menu" color={theme.COLORS.SEASHELL} size={35}/>
                    </TouchableOpacity>
                </View>
                
                <View style={{flex:3, alignItems:'center', justifyContent:'center', marginTop:10}}>
                    <View style={{flexDirection:'row', marginBottom:10}}>
                        <Text style={{color:theme.COLORS.JAPANESE_INDIGO, fontSize:16, fontWeight:'bold'}}>
                            Start Time : 
                        </Text>
                        <Text style={{color:theme.COLORS.JAPANESE_INDIGO, fontSize:16}}>
                            {this.formatDate(this.state.sessionStartTime)}
                        </Text>
                    </View>
                    {this.state.isWatchOK ?
                    <Stopwatch start secs laps
                        startTime = {this.state.stopwatchStartTime}
                        options = {stopwatchOptions}
                    />
                    :null}
                    <View style={{flexDirection:'row', marginBottom:10}}>
                        <Text style={{color:theme.COLORS.JAPANESE_INDIGO, fontSize:24, fontWeight:'bold'}}>
                            Total : 
                        </Text>
                        <Text style={{color:theme.COLORS.JAPANESE_INDIGO, fontSize:24}}>
                            {this.state.amount.toFixed(2)} ₺
                        </Text>
                    </View>
                    
                    
                </View>
                
                
                {this.state.isOK ?
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <ToggleSwitch
                        text={{on: 'UNLOCKED',
                              off: 'LOCKED', 
                              activeTextColor: theme.COLORS.JAPANESE_INDIGO, 
                              inactiveTextColor: theme.COLORS.JAPANESE_INDIGO}}
                        textStyle={{fontWeight: 'normal', fontSize:16, fontStyle:'italic'}}
                        color={{ indicator: theme.COLORS.JAPANESE_INDIGO, 
                                 active: 'lightgreen', 
                                 inactive:  'tomato', 
                                 activeBorder: theme.COLORS.SEASHELL, 
                                 inactiveBorder: theme.COLORS.SEASHELL}}
                        active={!this.state.isLocked}
                        disabled={false}
                        width={150}
                        radius={35}
                        onValueChange={() => {
                            this.changeLockState();
                        }}
                    />
                </View>
                : null}

                <View style={{flex:1, flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-end'}}>
                    <TouchableOpacity
                        style={{
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor:theme.COLORS.JAPANESE_INDIGO,
                            flex:1,
                            height:60
                        }}
                        onPress = {this.endSession}
                    >
                        <Text style={{fontSize: 16, fontWeight: '400', color: theme.COLORS.SEASHELL,}}>END SESSION</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    
}

const styles = StyleSheet.create({
    container:{
        flex:1, 
        alignItems:'center', 
        backgroundColor: theme.COLORS.SEASHELL,
    }
  });

  const stopwatchOptions = {
    container: {
        alignItems:'center',
        justifyContent:'center',
        width:180,
        height:180,
        borderRadius:90,
        marginBottom:40,
        backgroundColor: theme.COLORS.DIAMOND,
    },
    text: {
      fontSize: 35,
      fontWeight: 'bold',
      color: theme.COLORS.JAPANESE_INDIGO,
    }
  };
