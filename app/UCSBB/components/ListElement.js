import React from 'react';

import InfoIcon from '../components/InfoIcon';
import { Text } from 'react-native';


export default function ListElement(props) {
  var whitespace = '                                                     ';
    return (
        <Text style = {{ fontSize: 24, fontFamily: 'Courier', textAlign: 'left' }}> 
        {(props.text + whitespace).slice(0,21)} 
        {props.access=='wheelchair' ? <InfoIcon name = 'wheelchair' /> : <>{'  '}</>}
        {' '}
        <InfoIcon name = {props.gender} />
        </Text>
      );
    
}