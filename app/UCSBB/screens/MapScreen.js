import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';

import UCSBBMapView from '../components/UCSBBMapView.js';

import { MonoText } from '../components/StyledText';

import WelcomePopup from '../components/WelcomePopup';


class MapScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
  //get parameters from routing 
  const { params } = this.props.navigation.state;
  const selectedRoomLatitude = params ? params.latitude : null;
  const selectedRoomLongitude = params ? params.longitude : null;

  return (
    <>
      <WelcomePopup pagekey={"uniqukey"} title={"Welcome"} description={"Head to settings in the bottom right to filter bathrooms shown on the map!"}/>
      <UCSBBMapView
      selectedRoomLatitude={selectedRoomLatitude}
      selectedRoomLongitude={selectedRoomLongitude} />
    </>
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
});

export default MapScreen;
