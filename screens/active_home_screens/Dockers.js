import { StyleSheet, View, Dimensions, Text,TouchableOpacity} from 'react-native';
import React from 'react';
import {Button,Icon} from 'react-native-elements';
import Geojson from 'react-native-geojson';
import MapView,{PROVIDER_GOOGLE,Marker,MapViewAnimated} from 'react-native-maps';
import theme from '../../constants/Theme';
import AsyncStorage from '@react-native-community/async-storage';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';
var defaultRegion = {
            "latitude": 0,
            "longitude": 0,
            latitudeDelta: 0,
            longitudeDelta: 0
};
var featurf= null;
export default class Zones extends React.Component{
  constructor (props) {
    super(props);
    this.state={
        virtualZones:{
          type: 'FeatureCollection',
          features:[],
        },
        markers:[],
        region: defaultRegion,
        closestZone:{
          latitude:0,
          longitude:0
        },
        flag:0,
        jwt:null
    };}

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
  findClosestZone  = async () => {
    this.setState({ loading: true, disabled: true ,responseJS: ""}, () => {
      fetch('http://35.189.94.121/zones/closestZone/'+JSON.stringify(this.state.region),{
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.state.jwt}`
        },
      }).then((response) => response.json()).then( async (responseJson) => {
            this.setState({ loading: false, disabled: false });
            this.setState({closestZone:{

              latitude:responseJson.data.geometry.coordinates[1],
              longitude:responseJson.data.geometry.coordinates[0],
            }})
            this.setState({flag:1});

        }).catch((error) => {
            console.error(error);
            this.setState({ loading: false, disabled: false });
          });
    })
  }
  getBikes = async () => {
    this.setState({ loading: true, disabled: true ,responseJS: ""}, () => {
      fetch('http://35.189.94.121/zones/withBikes', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.state.jwt}`
        },
      }).then((response) => response.json()).then( async (responseJson) => {
        this.setState({ loading: false, disabled: false });    
        if(responseJson.data!=null){
          const features = responseJson.data.map((result) => ({
            key:result.currentZone.id,
            type: result.currentZone.polygon.type,
            properties:result.currentZone.polygon.properties,
            geometry:result.currentZone.polygon.geometry,
            center:result.center,
            number: result.availableBikeNumber,
          }))
          this.setState(features.map((zones)=>(
            this.state.virtualZones.features.push(zones)
          )))

          const markers = this.state.virtualZones.features.map((result) => ({
            key:result.key,
            title:result.properties.name,
            center:{
              latitude:result.center.geometry.coordinates[1],
              longitude:result.center.geometry.coordinates[0]
            },
            number:result.number,
          }))
          this.setState({markers});

            }
  
        }).catch((error) => {
            console.error(error);
            this.setState({ loading: false, disabled: false });
          });
    })
  }
  currentLocationButton = async () => {
    this.setState({ loading: true, disabled: true}, () => {
    Geolocation.getCurrentPosition(
      (position)=>{
        this.setState({
          region: {
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          },
        });
      },
      {enableHighAccuracy:true,timeout:20000,maximumAge:1000}
    )
    })
  };

  async UNSAFE_componenWillMount () {
    var position = null;
    position = await this._retrieveData('position');
    position = JSON.parse(position);
    if(position != null){
      this.setState({region:position})
    }
    user = await this._retrieveData('user');
    if(user != null){
        userjsoned = JSON.parse(user);
        this.setState({jwt:userjsoned.jwt});
    }
    else{
        alert("User authentication failed.");
    } 
    this.interval = setInterval(() => this.getBikes(), 1000); // amount reload every 10 secs.
  };
  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      region: region,
      // If there are no new values set the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
    this._storeData("position", JSON.stringify(this.state.region));
  }
 async componentDidMount() {
  user =  await this._retrieveData('user');
    if(user != null){
        userjsoned = JSON.parse(user);
        this.setState({jwt:userjsoned.jwt});
    }
    else{
        alert("User authentication failed.");
    } 
  let region = null;
  Geolocation.getCurrentPosition((position) => {
    region = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta:0.003,
      longitudeDelta:0.003,
    }
    this.onRegionChange(region,region.latitude,region.longitude);
    }, (error) => {
    alert(JSON.stringify(error.message))
     }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    });
    this._storeData("position", JSON.stringify(region));

    
    
}
  

  componentWillUnmount() {
    clearInterval(this.interval);
  }

    render() {
   
        return (
         
          <View style={styles.container}
          
          >
            <MapView
                provider={PROVIDER_GOOGLE}
                onMapReady = {this.getBikes}
                showsUserLocation={true}
                //onPress = {this.getBikes}
                style={styles.mapStyle}
                region={{
                    latitude:this.state.region.latitude,
                    longitude: this.state.region.longitude,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta,
                  }}
              >
              <Geojson 
                geojson={this.state.virtualZones} 
                strokeColor="red"
                strokeWidth={3}
              />
               {
               this.state.markers.map(marker  =>  ( 
                  <Marker 
                    key={marker.key}
                    coordinate={marker.center}
                    title={marker.title}
                  >
                    <View style={styles.marker}>
                      <Text style={{color:theme.COLORS.SEASHELL, fontWeight:'bold', fontSize:18}}>{marker.number}</Text>
                    </View>
                </Marker>
              ))}
              {this.state.flag ? 
                <MapViewDirections
                apikey={'AIzaSyA8yhD20RKHZrL2cDGOJXRVK_nm-Nb5ykE'}
                origin = {{latitude:this.state.region.latitude,longitude:this.state.region.longitude}}
                destination = {this.state.closestZone}
                strokeWidth={3}
                strokeColor="darkblue"
                mode = "WALKING"
                />
                :null
              }
             </MapView>
             <Button
                onPress={this.findClosestZone}
                icon = {<Icon type='material-community' name='find-replace' size={30}></Icon>}
                buttonStyle={{backgroundColor:'white', borderRadius:50} }
                containerStyle={{position:'absolute',bottom:'24%',right:'7%'}}
                 >
                </Button>
              <Button
                onPress={this.currentLocationButton}
                icon = {<Icon type='material-community' name='crosshairs-gps' size={30}></Icon>}
                buttonStyle={{backgroundColor:'white', borderRadius:50} }
                containerStyle={{position:'absolute',bottom:'12%',right:'7%'}}
                 >
              </Button>
          </View>
        );
    }
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: theme.COLORS.JAPANESE_INDIGO,
    borderColor: theme.COLORS.SEASHELL, 
    borderWidth:1,
    width:40,
    height:40,
    borderRadius:20
  }
});