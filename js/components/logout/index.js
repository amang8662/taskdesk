import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import { Actions } from 'react-native-router-flux';

export default class Logout extends Component<{}> {

  async logout() {
    
    try {
      await AsyncStorage.removeItem('userid'); 
      Actions.reset('unauthenticated');
    } catch(error) {
      console.error(error);
      alert('Sorry, Some Error Occured!');
    }
  }

	render(){
    
    return(
      <TouchableOpacity style={this.props.style ? this.props.style.button : styles.button} onPress={this.logout}>
        <Text style={this.props.style ? this.props.style.buttonText : styles.buttonText}>{this.props.text ? this.props.text : "Logout"}</Text>
      </TouchableOpacity>
    )    
	}
}

const styles = StyleSheet.create({
  button: {
    width:200,
    backgroundColor:'#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  }
});