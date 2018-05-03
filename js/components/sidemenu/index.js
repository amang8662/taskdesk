import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import User from '../../static/User';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default class SideMenu extends Component<{}> {

  constructor(props) {
    super(props);
  }

  async logout() {
    
    try {
      await AsyncStorage.removeItem('user'); 
      Actions.reset('unauthenticated');
    } catch(error) {
      console.error(error);
      alert('Sorry, Some Error Occured!');
    }
  }

  render(){

    return (
      <View style={styles.container}>
      
        <TouchableOpacity style={styles.listItem} onPress={() => Actions.dashboard()}>
          <Text style={styles.text}>DashBoard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => Actions.yourtasks()}>
          <Text style={styles.text}>Your Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => Actions.task()}>
          <Text style={styles.text}>Generated Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => Actions.aboutus()}>
          <Text style={styles.text}>About Us</Text>
        </TouchableOpacity>
        
        {User.get().user_type == 1 ? 
          (<TouchableOpacity style={styles.listItem} onPress={() => Actions.addskill()}>
            <Text style={styles.text}>Add Skill</Text>
          </TouchableOpacity>)
          : null
        }
        

        <TouchableOpacity style={styles.listItem} onPress={this.logout}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#212121',
    flex: 1,
    paddingTop: 5
  },
  listItem: {
    height:50,
    backgroundColor:'#f44336',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 10,
    marginTop: 0
  },
  text: {
    fontSize: 22,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#fff' 
  },
  drawerCover: {
    alignSelf: "stretch",
    // resizeMode: 'cover',
    height: deviceHeight / 3.5,
    width: null,
    position: "relative",
    marginBottom: 10
  },
  drawerImage: {
    position: "absolute",
    // left: (Platform.OS === 'android') ? 30 : 40,
    left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
    // top: (Platform.OS === 'android') ? 45 : 55,
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: 210,
    height: 75,
    resizeMode: "cover"
  }
});