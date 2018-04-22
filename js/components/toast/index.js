import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated,
  Dimensions
} from 'react-native';

import Button from './Button';

let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height

export default class Toast extends Component {

  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
    
    this.state = {
      modalShown: false,
      toastColor: 'green',
      message: 'Success!'
    }
  }

  show(message, type) {
    if(this.state.modalShown) 
      return;

    this.setToastType(message, type)
    this.setState({ modalShown: true })
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 350
      }).start()
  }
  
  hide() {
    setTimeout(() => {
      this.setState({ modalShown: false })
      Animated.timing(
      this.animatedValue,
      { 
        toValue: 0,
        duration: 350
      }).start()
    }, 2000)
  }

  setToastType(message='Success!', type='success') {
    let color
    if (type == 'error') color = 'red'
    if (type == 'primary') color = '#2487DB'
    if (type == 'warning') color = '#ec971f'
    if (type == 'success') color = 'green'
    this.setState({ toastColor: color, message: message })
  }

  render() {

    let animation = this.animatedValue.interpolate({
       inputRange: [0, 1],
       outputRange: [windowHeight + 30, windowHeight - 20]
     })

    return (
      <View>
        <View style={styles.container}>
            <Button type="primary" callToast={ () => this.show('Primary toast called!', 'primary') }  />
            <Button type="bottom" callToast={ () => this.hide() }  />
        </View>

        <Animated.View  style={{
            transform: [{ translateY: animation }],
            height: 50,
            backgroundColor: this.state.toastColor,
            position: 'absolute',
            left:0,
            bottom:0,
            right:0,
            justifyContent: 'center'
          }}>

          <Text style={styles.animatedText}>
            { this.state.message }
          </Text>
        </Animated.View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedText: {
    marginLeft: 10,
    color: 'white',
    fontSize:16,
    fontWeight: 'bold'
  }
});