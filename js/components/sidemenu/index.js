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
          <Button transparent>
            <Icon name="ios-home" style={{ color: "#fcfcfc",  }} />
            <Text style={styles.text}>
                DashBoard
            </Text>
          </Button>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => Actions.yourtasks()}>
          <Button transparent>
            <Icon name="md-calendar" style={{ color: "#fcfcfc",  }} />
            <Text style={styles.text}>
                Your Tasks
            </Text>
          </Button>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => Actions.task()}>
          <Button transparent>
            <Icon name="md-create" style={{ color: "#fcfcfc",  }} />
            <Text style={styles.text}>
                Generated Tasks
            </Text>
          </Button>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => Actions.aboutus()}>
          <Button transparent>
            <Icon name="information-circle" style={{ color: "#fcfcfc",  }} />
            <Text style={styles.text}>
                About Us
            </Text>
          </Button>
        </TouchableOpacity>
        
        {User.get().user_type == 1 ? 
          (<TouchableOpacity style={styles.listItem} onPress={() => Actions.addskill()}>
            <Button transparent>
              <Icon name="md-add-circle" style={{ color: "#fcfcfc",  }} />
              <Text style={styles.text}>
                  Add Skill
              </Text>
            </Button>
          </TouchableOpacity>)
          : null
        }
        

        <TouchableOpacity style={styles.listItem} onPress={this.logout}>
          <Button transparent>
            <Icon name="md-log-out" style={{ color: "#fcfcfc",  }} />
            <Text style={styles.text}>
                Logout
            </Text>
          </Button>
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
    marginTop: 0
  },
  text: {
    fontSize: 18,
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