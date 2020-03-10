import React, {Component} from 'react';
import { View, TouchableOpacity, Dimensions, Text, FlatList, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import InfoIcon from '../components/InfoIcon';


export default class Accordian extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
        }
    }
  
  render() {

    return (
       <View>
            <TouchableOpacity style={styles.row} onPress={()=>this.toggleExpand()}>
                <Text style={[styles.title]}>{this.props.title}</Text>
                <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#5E5E5E'} />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style={{}}>
                    <FlatList
                    data={this.state.data}
                    numColumns={1}
                    scrollEnabled={false}
                    renderItem={({item, index}) => (
                        <View>
                            <TouchableOpacity style={[styles.childRow, item.gender == 'male' ? styles.male : styles.female]} onPress = {() => {this.props.navigation.navigate('Map') }}>
                                <Text style={[styles.font, styles.listItemText]} >{item.room}</Text>
                                <View style={styles.genderIcons}>
                                    <InfoIcon name={item.gender == 'neutral' ? 'user' : item.gender} size={24} />
                                </View>
                                    <InfoIcon name={item.access} size = {24}/>
        
                            </TouchableOpacity>
                            <View style={styles.childHr}/>
                        </View>
                    )}
                    keyExtractor={item => item.ID}
                    />
                </View>
            }
            
       </View>
    )
  }

  onClick=(index)=>{
    const temp = this.state.data.slice()
    temp[index].value = !temp[index].value
    this.setState({data: temp})
  }

  toggleExpand=()=>{
    this.setState({expanded : !this.state.expanded})
  }

}

  const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button:{
        width: Dimensions.get('window').width,
        height:54,
        alignItems:'center',
        fontSize: 12,
    },
    title:{
        fontSize: 22,
        fontWeight:'bold',
        color: '#5E5E5E',
    },
    listItemText:{
        fontSize: 24,
        color: '#000000',
        textAlign: 'left',
    },
    male:{
        flexDirection: 'row',
        justifyContent:'space-around',
        backgroundColor: '#ffffff',
        height:58,
        alignItems:'center',
        fontSize: 12,
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:68,
        width: Dimensions.get('window').width,
        paddingLeft:50,
        paddingRight:50,
        alignItems:'center',
        backgroundColor: '#e2f4fd',
    },
    female:{
        flexDirection: 'row',
        justifyContent:'space-around',
        backgroundColor: '#ffffff',
        height:58,
        alignItems:'center',
        fontSize: 12,
    },
    neutral:{
        flexDirection: 'row',
        justifyContent:'space-around',
        backgroundColor: '#ffff80',
        height:54,
        alignItems:'center',
        fontSize: 12,
    },
    parentHr:{
        height:1,
        color:'#061d56',
        width:'100%'
    },
    childHr:{
        height:2,
        backgroundColor: '#061d56',
        width:'100%',
    },
    genderIcons:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }

});