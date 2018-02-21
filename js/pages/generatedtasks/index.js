import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { Actions } from 'react-native-router-flux';

export default class GeneratedTasks extends Component<{}> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>GeneratedTasks</Text>
        <TouchableOpacity style={{
            width:200,
            backgroundColor:'#1c313a',
            borderRadius: 25,
            marginVertical: 10,
            paddingVertical: 13
          }} onPress={() => Actions.edittask()}>
          <Text style={{
              fontSize:16,
              fontWeight:'500',
              color:'#ffffff',
              textAlign:'center'
            }}>Edit Task</Text>
        </TouchableOpacity>
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