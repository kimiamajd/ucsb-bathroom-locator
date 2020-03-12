import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import CollapsibleList from "react-native-collapsible-list";
import ListElement from '../components/ListElement';
import { MonoText } from '../components/StyledText';
import {db} from '../firebase.js';
import Accordian from '../components/Accordian'
import { YellowBox } from 'react-native';


YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
YellowBox.ignoreWarnings(['Warning: Failed prop type: Invalid prop']);

var rootRef = db.ref('/Buildings');
var buildingList;

// retrieve keys
rootRef.on("value", function(snapshot){
  var data = snapshot.val();
  buildingList = Object.keys(data);
});

class BathroomsScreen extends React.Component {
  static navigationOptions = {
    title: 'Bathrooms by Building',
  };

  render () {
    var lists = [];
    var viewsArray = [];

    for(var i=0; i<buildingList.length; i++){
    // retrieve children
    rootRef.child(buildingList[i]).on("value", function(snapshot){
      var data = snapshot.val();
      var roomList = Object.keys(data);

      var views = [];

      for (var j=0; j<roomList.length; j++){

        room = roomList[j];
        var flag_access = data[room].Accessibility;
        var accessChair = ((flag_access=='True') ? 'wheelchair' : 'none');
        var listStyle = ((data[room].Gender=='male') ? styles.collapsibleItemMale : styles.collapsibleItemFemale);
        if (data[room].Gender=='neutral') {
          listStyle = styles.collapsibleItemNeutral;
        }
        //push room names, gender, and accessibility into array called views
        views.push({
          ID: buildingList[i]+roomList[j],
          room: rootRef.child(buildingList[i]).child(roomList[j]).key,
          gender: data[roomList[j]].Gender,
          access: accessChair,
          latitude: data[room].Latitude,
          longitude: data[room].Longitude,
      });
    
    lists.push(
      <Accordian
      key={buildingList[i]}
      numberOfVisibleItems={0}
      title = {buildingList[i]}
      data = {viewsArray[i]}
      navigation = {this.props.navigation}
      />
      )};

    return (
      <View style={styles.container}>
      <ScrollView
      key={0}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>   
      {lists}
      </View>
      </ScrollView>
      </View>
      );
  }
}

BathroomsScreen.navigationOptions = {
  title: 'Bathrooms by Building',
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  button: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: "rgba(230, 247, 233, 0.6)"
  },
  buttonText: {
    fontSize: 35,
    textAlign: 'center',
  },

  contentContainer: {
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  wrapperCollapsibleList: {
    flex: 1,
    marginTop: 20,
    overflow: "hidden",
    backgroundColor: "#FFF",
    borderRadius: 5
  },
  collapsibleItemText: {
    fontSize: 24,
    textAlign: 'left',
  },
  collapsibleItemMale: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    backgroundColor: "rgba(170, 226, 240, 0.9)",
    padding: 20
  },
  collapsibleItemFemale: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    backgroundColor: "rgba(255, 186, 215, 0.6)",
    padding: 20
  },
  collapsibleItemNeutral: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    backgroundColor: "rgba(255, 242, 128, 0.6)",
    padding: 20
  },
});

export default BathroomsScreen;

