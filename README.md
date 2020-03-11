### Continuous Integration (CI)

Each time a push is done on any git branch, the `CI Testing` github action will start which runs all tests against the current branch.

# UCSB Bathrooms
## Project Summary
### Description

UCSB Bathrooms, or UCSBB, is a mobile app that helps people on the UCSB campus locate the restrooms in the buildings closest to them.

### Additional Information

The app will help people who are currently on the UCSB campus. They will be able to use the built in map to locate nearby buildings as well as bathrooms within those buildings. Users will be able to see details of each bathroom such as room number, gender, and accessibility.

# Installation

### Prerequisites

Have a mobile device or a computer capable of running a mobile device simulator.

### Dependencies

react native maps (for the map on the homepage)

react native collapsible list (for the list on the bathrooms tab)


### Installation Process

install node.js from <https://nodejs.org/en/download/>, or use your favorite command line package manager (apt, pacman, homebrew, etc) to install npm

`git clone git@github.com:ucsb-cs48-w20/5pm-restroom.git` (one of us needs to enter our username and password!)

`cd 5pm-restroom/app/UCSBB`

`npm install -g expo-cli`

`npm install react-native-maps`

`npm i react-native-elements`

`npm install react-native-collapsible-list`

`npm install --save firebase`

`expo start`

on a computer:

to open in an Android simulator, type `a` in the command line or click the "run on android" button in the browser window that opens on localhost:19002

to open in an iOS simulator, type `i` in the command line or click the "run on iOS" button in the browser window that opens on localhost:19002

on a mobile device:

install expo on your mobile device from the Apple App Store/Google Play

scan the QR code that appears in the command line or the one on localhost:19002 to open the app in expo

ctrl + c in the command line closes the app


## Functionality

Usage:

The "map" tab (home screen) is a map of the UCSB campus with markers for buildings. Drag to move the map, and pinch to zoom. Markers can be tapped on to display building information.

The "bathrooms" tab contains a list of bathrooms in each building. Tap on a building name to reveal the list of bathrooms color coded by gender, as well as accessibility information. Tapping on the building name again collapses this list.


## Known Problems

There are currently no known problems.


## License

<https://github.com/ucsb-cs48-w20/5pm-restroom/blob/master/LICENSE>
