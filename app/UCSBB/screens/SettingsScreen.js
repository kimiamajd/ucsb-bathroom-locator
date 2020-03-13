import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Switch,
  AsyncStorage
} from 'react-native';
import { Card, Text, ButtonGroup, Button } from 'react-native-elements';
import { reload } from '../controllers/Controller.js'

const ACCESSIBILITY_TOGGLE_KEY = 'accessibility';
const GENDER_PREFERENCE_KEY = 'genderPreference';

export default class Home extends Component {

  //------------------------------------------------------------------------------------//
  //contains the settings data on accessibility and bathroom gender preferences
  //this data is saved internally and is not reset when exiting and restarting the app
  //the map on the home page should use the information here to adjust what is displayed
  //VERY IMPORTANT NOTE:
  //since this code is a frankenstein of stack overflow stuff, I was not able to get
  //state.genderPreference to be 'all', 'male', or 'female', but using the 3 colors
  //'red', 'cyan', and 'pink' in place should work the same way
  //THERE IS ANOTHER VERY IMPORTANT NOTE BELOW IN THE COMMENTS
  //------------------------------------------------------------------------------------//
  state = {
    isHandicap: false,
    genderPreference: 'red'
  }

  //two arrays that hold the 3 bathroom gender preferences and the colors that coorespond to each
  genderPreferences = ['All', 'Male', 'Female'];
  colors = ['#30fc7f', '#aae2f0', '#f9bcd7'];

  //gives the title bar a title
  static navigationOptions = () => {
    return {
      title: 'Settings',
    }
  }

  //function that does the initial fetching of saved values when the settings tab is opened
  componentDidMount() {
    //this.props.navigation.setParams({ colors: this.colors });
    this.loadAsyncData();
  }

  //helper function for the above
  loadAsyncData = async () => {
    try {
      const isHandicap = await AsyncStorage.getItem(ACCESSIBILITY_TOGGLE_KEY)
      if (isHandicap !== null) {
        this.setState({ isHandicap: JSON.parse(isHandicap) });
      }
    } catch (e) {
      console.log(e)
    }

    try {
      const genderPreferenceIndex = await AsyncStorage.getItem(GENDER_PREFERENCE_KEY)
      if (genderPreferenceIndex !== null) {
        this.props.navigation.setParams({ genderPreferenceIndex: JSON.parse(genderPreferenceIndex) });
        this.setState({ genderPreference: this.colors[JSON.parse(genderPreferenceIndex)]})
      }
    } catch (e) {
      console.log(e)
    }

  }

  //uses Async to store a true or false value for the accessibility setting
  storeAccessibilityPreferences = async (key, isHandicap) => {
    try {
      await AsyncStorage.setItem(ACCESSIBILITY_TOGGLE_KEY, JSON.stringify(isHandicap))
      this.setState({ isHandicap });
    } catch (e) {
      console.log(e);
    }
  }

  //uses Async to store a color that represents the bathroom gender preference setting
  storegenderPreferences = async (key, genderPreferenceIndex) => {
    try {
      await AsyncStorage.setItem(GENDER_PREFERENCE_KEY, JSON.stringify(genderPreferenceIndex));
      this.props.navigation.setParams({ genderPreferenceIndex });
      this.setState({ genderPreference: this.colors[JSON.stringify(genderPreferenceIndex)]})
    } catch (e) {
      console.log(e);
    }
  }

  //resets accessibiliy to false and gender preference to all (red)
  restoreDefaults = () => {
    this.storeAccessibilityPreferences(ACCESSIBILITY_TOGGLE_KEY, false);
    this.storegenderPreferences(GENDER_PREFERENCE_KEY, 0);
  }

  applySettings = () => {
    this.props.navigation.navigate('Map')
  }

  render() {
    const genderPreferenceIndex = this.props.navigation.state.params ?
      this.props.navigation.state.params.genderPreferenceIndex : 0;

    //defines buttonRow text
    let buttons = [
      { element: () => <Text style={styles.buttonGroupText}>{this.genderPreferences[0]}</Text> },
      { element: () => <Text style={styles.buttonGroupText}>{this.genderPreferences[1]}</Text> },
      { element: () => <Text style={styles.buttonGroupText}>{this.genderPreferences[2]}</Text> }
    ]

    //------------------------------------------------------------------------------------//
    //IMPORTANT:
    //these two print statments will print the current value of the two state values to
    //terminal whenever anything is rerendered. Use this to debug and make sure things
    //are working correctly
    //------------------------------------------------------------------------------------//
    console.log('Accessibility: ' + this.state.isHandicap);
    console.log('Gender Preference: ' + this.state.genderPreference);

    return (
      <View style={styles.container}>

        <Card containerStyle={styles.card} title='Accessibility' >
          <View style={styles.row}>
            <Text style={{ fontSize: 16 }}>Only See Accessible Bathrooms</Text>
            <Switch
              style={{ marginLeft: 16 }}
              trackColor={{ true: 'green' }}
              thumbColor='white'
              value={this.state.isHandicap}
              onValueChange={(onlySeeAccessibleBathrooms) => {
                this.storeAccessibilityPreferences(ACCESSIBILITY_TOGGLE_KEY, onlySeeAccessibleBathrooms);
              }}
            />
          </View>
        </Card>

        <Card containerStyle={styles.card} title='Bathroom Gender Preference' >
          <ButtonGroup
            buttonStyle={{ backgroundColor: '#706669' }}
            selectedIndex={genderPreferenceIndex}
            selectedButtonStyle={{ backgroundColor: this.colors[genderPreferenceIndex] }}
            onPress={(buttonIndex) => {
              this.storegenderPreferences(GENDER_PREFERENCE_KEY, buttonIndex)
            }}
            buttons={buttons}
            containerStyle={styles.buttonGroup} />
        </Card>
  
        <Button
          containerStyle={styles.restoreButtonContainer}
          buttonStyle={{
            padding: 16,
            backgroundColor: 'green'
          }}
          onPress={this.restoreDefaults}
          title="Restore Defaults"
        />
        <Button
          containerStyle={styles.restoreButtonContainer}
          buttonStyle={{
            padding: 16,
            backgroundColor: 'purple'
          }}
          onPress={this.applySettings}
          title="Apply"
        />

      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'black',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#D0D3D4'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonGroup: {
    height: 60,
    width: 300
  },
  buttonGroupText: {
    fontSize: 18,
    color: 'white'
  },
  slider: {
    width: 250,
    marginLeft: 16
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#EAECEE',
    borderColor: '#ABB2B9',
    borderWidth: 0.3,
    width: '90%',
  },
  restoreButtonContainer: {
    margin: 32
  }
});