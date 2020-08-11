import * as React from 'react';
import { Text, View, StyleSheet, Button, PermissionsAndroid,TouchableOpacity} from 'react-native';
import theme from '../../constants/Theme';
import AsyncStorage from '@react-native-community/async-storage';
import Dialog from 'react-native-dialog';
import QRCodeScanner from 'react-native-qrcode-scanner';
export default class QRScanner extends React.Component {

  constructor(){
    super();
    this.state = {  qrCode: "",
                    userId: "",
                    zoneId:"",
                    bikeId : "",
                    session:null,
                    torchMode: 'off',
                    cameraType: 'back',
                    user: null,
                    position:{
                      latitude:0,
                      longitude:0,
                      latitudeDelta:0,
                      longitudeDelta:0,
                    },
                    loading: false,
                    disabled: false,
                    hasCameraPermission: null,
                    scanned: false,
                    visible:false,
                    jwt:null,
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

  checkBikeAvailability = () => {
    this.setState({ loading: true, disabled: true }, () => {
      fetch('http://35.189.94.121/bikes/checkAvailability/'+this.state.qrCode, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.state.jwt}`
        }
      }).then((response) => response.json()).then((responseJson) => {
        this.setState({ loading: false, disabled: false });
        if(responseJson.status===200){
          this.setState({
            bikeId:responseJson.data._id,
            visible:true,
            zoneId:responseJson.data.lastZoneId,
          });
        }
        else{
          alert(responseJson.message);
        }
        }).catch((error) => {
            console.error(error);
            this.setState({ loading: false, disabled: false });
          });
    });
  }
  saveData = () => {
    this.setState({ loading: true, disabled: true }, () => {
      fetch('http://35.189.94.121/usages/startSession', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.state.jwt}`
        },
        body: JSON.stringify({
            bikeId : this.state.bikeId,
            userId : this.state.user.user._id,
            lastZoneId : this.state.zoneId,// MM ZoneID
            location:[this.state.position.longitude,this.state.position.latitude],
        })
      }).then((response) => response.json()).then((responseJson) => {

        this.setState({ loading: false, disabled: false });
        
        if(responseJson.status===200){
          this.setState({session:responseJson.data});
          this._storeData("session", JSON.stringify(responseJson.data));
          this.props.navigation.navigate('Session');

        }
        else if (responseJson.status===500){
          alert("Invalid QR!!");
        }
        else{
          alert(responseJson.message);
        }
        }).catch((error) => {
            console.error(error);
            this.setState({ loading: false, disabled: false });
          });
    });
  }
  async UNSAFE_componentWillMount(){
    
  }
  async componentDidMount() {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    if(granted){
      this.setState({hasCameraPermission:true});
    }
    else{
      alert("CAMERA permission denied")
    }
    var currentUser = await this._retrieveData('user');
    var position = await this._retrieveData("position");
    currentUser = JSON.parse(currentUser);
    if(currentUser != null){
        
        this.setState({jwt:currentUser.jwt})
        this.setState({user:currentUser});
    }
    else{
        alert("User authentication failed.");
    }
    position = JSON.parse(position);
    if(position != null){
       this.setState({position:position});
    }
  }




  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: theme.COLORS.SEASHELL
        }}>
        <QRCodeScanner
          style={StyleSheet.absoluteFillObject}
          ref={(node) => { this.scanner = node }}
          onRead={scanned ? undefined : this.handleBarCodeScanned}
          showMarker={true}
        />
        <View>
            <Dialog.Container
              onBackdropPress={() => {this.setState({ visible: false })}} 
              visible={this.state.visible}>
              <Dialog.Title>Do you want to start session?</Dialog.Title>  
              <Dialog.Button label="OK" onPress={() => {this.saveData();this.setState({ visible: false });}} />
              <Dialog.Button label="Cancel" onPress={() => this.setState({ visible: false })} />
            </Dialog.Container>
          </View>
        {scanned && (
          <Button title={'Tap to Scan Again'} onPress={() => {this.setState({ scanned: false }); {this.scanner.reactivate()}}
        
        
            } />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true, qrCode: data });
    this.checkBikeAvailability();
    
  };
}