import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput 
} from 'react-native';

export default class InputText extends Component<{}> {
	render(){

    let style = this.props.style ? this.props.style : styles.inputBox;
    let errorStyle = this.props.errorStyle ? this.props.errorStyle : styles.inputBoxError;
		return(
			<TextInput
        style={this.props.isError ? errorStyle : style}
        selectionColor={this.props.placeholderTextColor ? this.props.placeholderTextColor :'#fff'}
        placeholderTextColor = {this.props.placeholderTextColor ? this.props.placeholderTextColor :'#aeaeae'}
        underlineColorAndroid={this.props.underlineColorAndroid ? this.props.underlineColorAndroid :'rgba(0,0,0,0)'}
        {...this.props} 
        />
		)
	}
}

const styles = StyleSheet.create({
  inputBox: {
    width:300,
    backgroundColor:'#222',
    borderBottomColor: '#eee',
    borderWidth: 2,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  inputBoxError: {
    width:300,
    borderWidth: 3,
    paddingHorizontal:16,
    fontSize:16,
    marginVertical: 10,
    borderStyle: 'solid',
    color: '#eee',
    backgroundColor: '#222',
    borderBottomColor : '#d83c3c'
  }
});