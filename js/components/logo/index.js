import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
   Image 
} from 'react-native';

export default class Logo extends Component<{}> {
	render(){
		return(
			<View style={styles.container}>
				<View style={styles.logo}>
          <Image style={{width:100,height:100}}   source={require('../../img/logo.png')} />
        </View>
        <Text style={styles.logoText}>Task Desk</Text>	
  		</View>
			)
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    alignItems: 'center',
  },
  logo :{
    padding: 16,
    marginTop: 10,
    backgroundColor:'#000',
    borderRadius: 22,
    borderColor: '#f44336',
    borderWidth: 3    
  },
  logoText : {
  	marginVertical: 15,
  	fontSize:22,
  	color:'#fff'
  }
});