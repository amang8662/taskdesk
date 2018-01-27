/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import Logout from '../../components/logout';

export default class Home extends Component<{}> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Home</Text>
        <Logout />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#455a64',
    flex: 1,
    paddingTop: 30,
    justifyContent:'center',
    alignItems: 'center'
  }
});