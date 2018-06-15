import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Card,
  CardItem,
} from 'native-base';


import { Actions } from 'react-native-router-flux';
import { baseurl } from '../../Globals';
import User from '../../helpers/User';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default class SideMenu extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      user: User.get()
    }
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
      <Container style={styles.container}>
        <Content>
            <Card style={{ elevation: 3}} >
              <CardItem bordered button onPress={() => Actions.profile()}>
                <Left style={{alignItems: 'center',}}>
                  <View style={styles.profilePicWrap} >
                      <Image style={styles.profilePic}  source={{uri: baseurl + "/uploads/avatar/" + this.state.user.avatar}} />
                  </View>
                </Left>
                <Body>
                      <Text>{this.state.user.title}</Text>
                      <Title style={styles.h1}>{this.state.user.name}</Title>
                      <Text note>Lvl.{this.state.user.level}</Text>
                </Body>
              </CardItem>
            </Card>
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
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  
  profilePicWrap:{
    width: 90,
    height: 90,
    borderColor: '#f44336',
    backgroundColor: '#292929',
    borderWidth: 5,
    borderRadius: 100,
    alignContent: 'center',
    elevation: 30
  },
  profilePic:{
    flex:1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 100,
  },
  h1 :{
    color: '#080808',
    fontStyle: 'italic' ,
  },
  listItem: {
    height:50,
    backgroundColor:'#f44336',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    elevation: 10,
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