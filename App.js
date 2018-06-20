/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar 
} from 'react-native';

import Toast from './js/components/toast';

import Routes from './js/Routes';

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
           backgroundColor="#dc2015"
           barStyle="light-content"
         />
        <Routes/>
        <Toast
          ref={c => {
            if (!Toast.toastInstance) Toast.toastInstance = c;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
  }
});