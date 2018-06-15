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
    width:null,
    alignSelf: 'stretch',
    color: '#222'
  },
  inputBoxError: {
    width:null,
    alignSelf: 'stretch' ,
    color: '#222',
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderBottomColor : '#d83c3c'
  }
});