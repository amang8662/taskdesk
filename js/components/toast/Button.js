import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

export default class Button extends Component<{}> {

  constructor(props) {
    super(props)
  }

  render() {
    let { callToast, type } = this.props
    return (
      <View style={ styles.buttonContainer }>
        <TouchableHighlight onPress={ callToast } underlayColor="#ddd" style={{ height:60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ededed', borderWidth: 1, borderColor: '#ddd' }}>
          <Text>Call { type } toast.</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70
  },
  buttonContainer: {
    marginTop:10,
    height: 30
  }
});