import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class EditProfile extends Component<{}> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>EditProfile</Text>
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