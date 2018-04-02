import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  NetInfo,
  ToastAndroid
} from 'react-native';

import { Spinner } from 'native-base';

import Logo from '../../components/logo';

import { Actions } from 'react-native-router-flux';

export default class LoadingScreen extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      message: 'Loading..'
    };
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
  }

  componentDidMount() {

    NetInfo.isConnected.fetch().then((isConnected) => {

        if(isConnected) {
          this.loginWithAsync();
        } else {
          
          ToastAndroid.show('No Internet Connection!', ToastAndroid.SHORT);
        }
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange(isConnected) {
    if(isConnected) {
      ToastAndroid.show('Connection Established', ToastAndroid.SHORT);
      this.loginWithAsync();
    } else {
      ToastAndroid.show('No Internet Connection!', ToastAndroid.SHORT);
    }
  }

  async loginWithAsync() {

    this.setState({
      message: 'Checking User..'
    });
    try {
      let userid = await AsyncStorage.getItem('userid');
      if(userid !== null) {
        Actions.reset('authenticated',{userid: userid});
      } else {
        Actions.reset('unauthenticated')
      }
    }catch(error) {
      console.error(error);
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <Logo />
        <View style={styles.messageContainer}>
          <Spinner color="#d7d4f0" />
          <Text style={styles.loadscreenText}>{this.state.message}</Text>
        </View>
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'rgba(0, 0, 0, 0.9)',
    flex: 1,
    paddingTop: 30,
    justifyContent:'flex-end',
    alignItems: 'center'
  },
  messageContainer: {
    flexGrow: 1,
    justifyContent:'flex-end',
    alignItems: 'center',
    paddingBottom: 50
  },
  loadscreenText : {
    marginVertical: 15,
    fontSize:18,
    color:'rgba(255, 255, 255, 0.7)'
  }
});