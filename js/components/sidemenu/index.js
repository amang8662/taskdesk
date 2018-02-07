import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';

import { Actions } from 'react-native-router-flux';

export default class SideMenu extends Component<{}> {

  constructor(props) {
    super(props);
  }

  async logout() {
    
    try {
      await AsyncStorage.removeItem('userid'); 
      Actions.reset('unauthenticated');
    } catch(error) {
      console.error(error);
      alert('Sorry, Some Error Occured!');
    }
  }

  dashboard() {
    Actions.dashboard()
  }

  render(){

    return (
      <View style={styles.container}>
        
        <TouchableOpacity style={styles.listContainer} onPress={this.dashboard}>
          <Text style={styles.text}>DashBoard</Text>
        </TouchableOpacity>
          
        <TouchableOpacity style={styles.listContainer} onPress={this.logout}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#fff',
    borderBottomColor: '#eee',
    flex: 1
  },
  listContainer: {
    height:50,
    backgroundColor:'#1c313a',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 10,
    paddingTop: 15,
    marginTop: 5
  },
  text: {
    fontSize: 18,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#fff' 
  }
});