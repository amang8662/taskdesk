import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';

let windowWidth = Dimensions.get('window').width
let windowHeight = Dimensions.get('window').height

export default class Toast extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
      showToast: false,
      text: 'Invalid Argument',
      buttonText: 'Okay'
    }
    this.animatedValue = new Animated.Value(0)
  }

  static toastInstance;
  static show({ ...config }) {
    this.toastInstance.processToast({ config });
  }

  static hide() {
    this.toastInstance.hideToast();
  }

  processToast({ config }) {
    if(this.state.showToast == true) {
      Animated.timing(
        this.animatedValue,
        {
          toValue: 0,
          duration: 100
        }).start();

      setTimeout(() => {
        this.setState({
          showToast: false
        },
          () => this.showToast({ config })
      );
      }, 200);
    } else {
      this.showToast({ config });
    }
  }

  showToast({ config }) {

    this.setState({
      showToast: true,
      text: config.text,
      textColor: config.textColor ? config.textColor : '#00ffff',
      buttonText: this.getButtonText(config.buttonText),
      buttonTextColor: config.buttonTextColor ? config.buttonTextColor : '#ffffff',
      buttonBackgroundColor: config.buttonBackgroundColor ? config.buttonBackgroundColor : '#f44336',
      toastColor: this.getToastColor(config.type),
      onClose: config.onClose
    });

    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 350
      }).start();

    if (config.duration && config.duration > 0) {

      setTimeout(() => {
        Animated.timing(
          this.animatedValue, {
          toValue: 0,
          duration: 350
        }).start();
        setTimeout(() => {
          this.setState({
            showToast: false
          });
        }, 500);
      }, config.duration);
    }
  }

  hideToast() {

    Animated.timing(
    this.animatedValue,
    {
      toValue: 0,
      duration: 350
    }).start();

    setTimeout(() => {
      this.setState({
        showToast: false
      });
    }, 500);
  }

  getButtonText(buttonText) {
    if (buttonText) {
      if (buttonText.trim().length === 0) {
        return 'Okay';
      } else return buttonText;
    }
    return 'Okay';
  }

  getToastColor(type='default') {
    let color
    if (type == 'default') color = '#474747'
    else if (type == 'error') color = 'red'
    else if (type == 'primary') color = '#2487DB'
    else if (type == 'warning') color = '#ec971f'
    else if (type == 'success') color = 'green'

    return color;
  }

  closeToast() {
    const { onClose } = this.state;

    if (onClose && typeof onClose === "function") {
      onClose();
    }

    this.hideToast();
  }

  render() {

    let animation = this.animatedValue.interpolate({
       inputRange: [0, 1],
       outputRange: [50, 0]
     })

    if (this.state.showToast) {
        
      return (

        <Animated.View  style={{
            transform: [{ translateY: animation }],
            height: 50,
            width: windowWidth,
            backgroundColor: this.state.toastColor,
            position: 'absolute',
            left:0,
            bottom:0,
            right:0,
            justifyContent: 'center'
          }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={[styles.animatedText, {color: this.state.textColor}]}>
              { this.state.text }
            </Text>

            <TouchableOpacity style={[styles.button, {backgroundColor: this.state.buttonBackgroundColor}]} onPress={() => this.closeToast()}>
              <Text style={[styles.buttonText, {color: this.state.buttonTextColor}]}>
                {this.state.buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    } else return null;
  }
}

const styles = StyleSheet.create({
  
  animatedText: {
    marginLeft: 20,
    fontSize:14,
    fontWeight: 'bold',
    flex: 5,
    maxWidth: windowWidth* 0.70,
    paddingTop: 15
  },
  button: {
    flex: 1,
    maxWidth: windowWidth* 0.30,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    paddingTop: 15
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center'
  }
});