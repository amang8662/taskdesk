import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { Actions } from 'react-native-router-flux';

export default class Home extends Component<{}> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 30,color: '#fff'}} >Choose to Be A :  </Text>
        <View style={styles.col}>
          <TouchableOpacity style={ styles.button} onPress={() => Actions.taskinfo()}>
            <Text style={styles.textBtn}>Task Generator</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ styles.button} onPress={() => Actions.taskinfo()}>
            <Text style={styles.textBtn}>Task Taker</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'rgba(0, 0, 0, 0.9)',
    flex: 1 ,
    paddingTop: 50,
    alignItems: 'center'
  },
  col : {
    flex: 1/2,
    alignItems: 'center',
    justifyContent: 'space-around' ,
  },
  textBtn: {
    fontSize: 28,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff' ,
    padding: 12
  },
  button : {
    width:250,
    backgroundColor:'#f44336',
    borderRadius: 0,
    padding: 11
  }
});