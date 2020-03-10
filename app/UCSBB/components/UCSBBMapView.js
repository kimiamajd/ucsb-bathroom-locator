import React, { Component } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import {db} from '../firebase.js';

var rootRef = db.ref('/Buildings');
console.log(rootRef)
var buildingList;

// retrieve keys
rootRef.once("value", (snapshot) =>{
	var data = snapshot.val();
	buildingList = Object.keys(data);
});

var lists = [];

const LAT = 34.413963;
const LONG = -119.846446;
const {width, height} = Dimensions.get('window');

export default class UCSBBMapView extends Component {

	//Gender must be either "male", "female", or "all" or else this will not work!!
	loadMarkers(gender, accessibility){
		var genders = ["male", "female", "all"];
		if( !genders.includes(gender) ){
			console.error("Gender must be male, female, or all");
		}

		rootRef.on("value", (snapshot) => {
			let data = snapshot.val();
			let buildingList = Object.keys(data);

			this.state.buildings = buildingList;
			var views = [];
			for(var i=0; i<buildingList.length; i++){
				rootRef.child(buildingList[i]).once("value", function(snapshot){
					//forEach iterates through all the results
					snapshot.forEach( (child) => {
						//val() gets the actual data from each of the objects
						let data = child.val();
						var genderColor = "rgb(255,20,147)";

						if(data.Gender == "female"){
							genderColor = "rgb(255,20,147)";;
						}
						else if(data.Gender == "male"){
							genderColor = "#0000FF";
						}
						else{
							genderColor = "#32CD32";
						}
						let mf = ["male", "female"]
						let followsGender = !mf.includes(gender) || data.Gender == gender;
						let followsAccessibility = !(accessibility && !data.Accessibility);
						//ensure that latitude and longitude exist and that accesibility rules from settings are followed
						if(data.Latitude && data.Longitude && followsAccessibility && followsGender){
							views.push({
								title: child.key,
								coordinates: {latitude: data.Latitude, longitude: data.Longitude},
								pinColor: genderColor,
								description: data.Gender,
							})}
						})
				}
				);
			}
			this.setState({
				buildings: buildingList, 
				markers: views,
			});
		})
		
	}

	componentDidMount(){
		this.loadMarkers("all", true);
	}

	constructor(props) {
		super(props);
		this.state = {
			camera: {
				center: {
					latitude: LAT,
					longitude: LONG,
				},
				zoom: 15,
				pitch: 0,
				heading: 0,
				altitude: 0
			},
			buildings: [],
			markers: [],
		}
	}

	onRegionChange(region) {
		this.setState({region});
	}

	render() {
		return (
			<View style={styles.container}>
			<MapView
			style = {styles.mapStyle}
			initialCamera = {this.state.camera}
			ref = {map => {this.map = map}}
			mapType = "standard"
			provider = {MapView.PROVIDER_GOOGLE}
			showsUserLocation = {true}
			showsMyLocationButton = {true}
			minZoomLevel = {15}
			mapPadding={{top: 0, right: 0, bottom: 50, left: 0}} // For position of location button
			>
			{
				this.state.markers.map((marker,index) => (
					<MapView.Marker
					key = {index}
					coordinate = {marker.coordinates}
					title = {marker.title}
					pinColor = {marker.pinColor}
					description = {marker.description}
					/>))
			}
			</MapView>
			</View>
			);
	}
}

const styles = StyleSheet.create({
	mapStyle: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
