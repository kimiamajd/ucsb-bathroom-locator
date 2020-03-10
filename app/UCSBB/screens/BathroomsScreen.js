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
import Accordian from '../components/Accordian';
import Home from './SettingsScreen';
import { YellowBox } from 'react-native'; // ignore warnings for now
import { Button} from 'react-native';
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
YellowBox.ignoreWarnings(['Warning: Failed prop type: Invalid prop']);
YellowBox.ignoreWarnings(['Setting a timer for a long period']);

var rootRef = db.ref('/Buildings');
var buildingList;


// display data objects when "Buildings" is modified
rootRef.on("child_changed", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// retrieve keys
rootRef.on("value", function(snapshot){
  var data = snapshot.val();
  buildingList = Object.keys(data);
});



class BathroomsScreen extends React.Component {
  static navigationOptions = {
    title: 'Bathrooms by Building',
  };
  
  state = {
    flag : 0
  }


filterEnable() {
  var lists = [];
  var viewsArray = [];

  var gender_db_flag = '0';
  var access_db_flag = 'false';
  db.ref('Storage').on("child_changed", function(snapshot){
    var storageData = snapshot.val();
    if (storageData == '0' || storageData == '1' || storageData == '2')
      gender_db_flag = storageData;
    else
      access_db_flag = storageData;
  });


  for(var i=0; i<buildingList.length; i++){
    
    // filter by gender
    var query = rootRef.child(buildingList[i]);
    if (gender_db_flag == '1'){
      query = query.orderByChild('Gender').equalTo('male');
    }
    else if (gender_db_flag == '2'){
      query = query.orderByChild('Gender').equalTo('female');
    }
    
    // retrieve children
    query.on("value", function(snapshot){
      var data = snapshot.val();
      var roomList = Object.keys(data);
      var views = [];

      for (var j=0; j<roomList.length; j++){
        var room = roomList[j];

        // filter by accessibility
        if (access_db_flag == 'true' && data[room].Accessibility == 'False')
          continue;

        var flag_access = data[room].Accessibility;
        var accessChair = ((flag_access=='True') ? 'wheelchair' : 'none');
        var listStyle = ((data[room].Gender=='male') ? styles.collapsibleItemMale : styles.collapsibleItemFemale);
        if (data[room].Gender=='neutral') {
          listStyle = styles.collapsibleItemNeutral;
        }
        //push room names, gender, and accessibility into array called views
        views.push({
          ID: buildingList[i]+roomList[j],
          room: room,
          gender: data[roomList[j]].Gender,
          access: accessChair,
        });
      }

        viewsArray.push(views);
        //push array with room info into an array where each element contains an array of roominfo for a specific building
    });

    
    lists.push(
        <Accordian
            key={buildingList[i]}
            numberOfVisibleItems={0}
            title = {buildingList[i]}
            data = {viewsArray[i]}
            navigation = {this.props.navigation}
            />
    )
  }
  // console.log(lists.length)

  
  if (lists.length != 0)
    this.state.flag = 1;

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


default() {
  var lists = [];
  var viewsArray = [];
  for(var i=0; i<buildingList.length; i++){
    var query = rootRef.child(buildingList[i]);

    query.on("value", function(snapshot){
      var data = snapshot.val();
      var roomList = Object.keys(data);
      var views = [];

      for (var j=0; j<roomList.length; j++){
        var room = roomList[j];

        var flag_access = data[room].Accessibility;
        var accessChair = ((flag_access=='True') ? 'wheelchair' : 'none');
        var listStyle = ((data[room].Gender=='male') ? styles.collapsibleItemMale : styles.collapsibleItemFemale);
        if (data[room].Gender=='neutral') {
          listStyle = styles.collapsibleItemNeutral;
        }
        //push room names, gender, and accessibility into array called views
        views.push({
          ID: buildingList[i]+roomList[j],
          room: room,
          gender: data[roomList[j]].Gender,
          access: accessChair,
        });
      }

        viewsArray.push(views);
        //push array with room info into an array where each element contains an array of roominfo for a specific building
    });

    lists.push(
        <Accordian
            key={buildingList[i]}
            numberOfVisibleItems={0}
            title = {buildingList[i]}
            data = {viewsArray[i]}
            navigation = {this.props.navigation}
            />
    )
  }
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


  render () {
    this.filterEnable()
    if (this.state.flag == 1)
      return this.filterEnable()
    else
      return this.default()
  }
  
}


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