import React, {StyleSheet} from 'react-native'

export default StyleSheet.create({
	container : {
	  backgroundColor:'#000',
	  flexGrow: 1,
	  paddingTop: 30,
	  paddingBottom: 30
	},
	formContainer : {
	  flexGrow: 1,
	  justifyContent:'center',
	  alignItems: 'center'
	},
	text: {
	  fontSize: 20,
	  color: '#00ffff',
	  alignItems: 'flex-start',
	  justifyContent: 'flex-start' 
	},
	button: {
	  width:300,
	  backgroundColor:'#369',
	  borderRadius: 0,
	  marginVertical: 10,
	  paddingVertical: 15
	},
	buttonText: {
	  fontSize:18,
	  fontWeight:'500',
	  color:'#ffffff',
	  textAlign:'center'
	}
});