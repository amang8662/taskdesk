import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  NetInfo
} from 'react-native';

import { Spinner } from 'native-base';
import User from '../../helpers/User';
import { Logo, Toast } from '../../components';

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

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );

    NetInfo.isConnected.fetch().then((isConnected) => {

        if(isConnected) {
          Toast.hide();
          this.loginWithAsync();
        }
    });
  }

  handleFirstConnectivityChange(isConnected) {
    if(isConnected) {
      
      Toast.show({text: 'Connection Established',
        buttonText: 'Go Online',
        onClose: () => this.loginWithAsync()
      });
    } else {
      Toast.show({text: 'No Internet Connection!',
        textColor: '#cccccc',
        duration: 10000});
    }
  }

  componentWillUnmount() {

    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  async loginWithAsync() {

    this.setState({
      message: 'Checking User..'
    });
    try {
      let user = await AsyncStorage.getItem('user');
      if(user !== null) {
        
        User.set(user);
        Actions.reset('authenticated');
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
          <Spinner color="#dc4239" />
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