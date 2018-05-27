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
        <Spinner color='#0000ff' />
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
    backgroundColor: '#dcdcdc'
  },
  text: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#303030'
  }
});