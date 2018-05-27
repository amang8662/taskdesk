import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class TextInputError extends Component<{}> {
	render(){
    if(this.props.isError == true) {
      return(
      <View style={this.props.styles ? this.props.styles.container : errorStyle.container}>
        <Text style={this.props.styles ? this.props.styles.errorText : errorStyle.errorText}>{this.props.message}</Text>  
      </View>
      )
    } else {
      return null;
    }
	}
}

const errorStyle = StyleSheet.create({
  container : {
    justifyContent:'flex-start',
    alignItems: 'flex-start',    
    paddingHorizontal:16,
  },
  errorText : {
    color: '#bbb',
    fontSize: 14
  }
});