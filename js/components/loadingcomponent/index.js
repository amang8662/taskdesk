import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Spinner } from 'native-base';

export default class LoadingComponent extends Component<{}> {

	render(){
    
    return(
      <View style={styles.container}>
        <Spinner size={50} color='#00c0ef' />
        <Text style={styles.text}>Loading...</Text>
      </View>
    )    
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#1c1f24'
  },
  text: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    color: '#A9A9A9'
  }
});