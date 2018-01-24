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
      <View style={this.props.styles.container}>
        <Text style={this.props.styles.errorText}>{this.props.message}</Text>  
      </View>
      )
    } else {
      return null;
    }
	}
}