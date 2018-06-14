import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity
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
  Text,
  Card,
  CardItem,
  Thumbnail,
  Item,
  Col
} from 'native-base';

import { Actions } from 'react-native-router-flux';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';
export default class Profile extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      user: User.get()
    }
  }

  render() {

    return (
      <Container style={styles.container}>
        <Header          style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
          <Left>
            <Button transparent onPress={() => Actions.dashboard()}>
              <Icon name="arrow-back" style={{ color: "#FFF" }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#FFF" }}>{this.state.user.username}</Title>
          </Body>
          <Right>
            
            <Button transparent onPress={() => Actions.editprofile()}>
              <Icon name="md-build" style={{ color: "#FFF" }} />
            </Button>
          </Right>
        </Header>
        <Content>
          <View style={styles.bar} >

              <View style={styles.barItem }>
                
                <Text style={styles.barTop}> Score</Text>
                <Text style={styles.barBottom}>{this.state.user.score}</Text>

              </View>
              <View style={styles.barItem}>
                
                <Text style={styles.barTop}> Level</Text>
                <Text style={styles.barBottom}>{this.state.user.level}</Text>

              </View>
          </View>
          
            <Content padder >
              <Card style={{ elevation: 3}}>
                <CardItem bordered>
                  <Body style={{alignItems: 'center',}}>
                    <View style={styles.profilePicWrap} >
                        <Image style={styles.profilePic}  source={{uri: baseurl + "/uploads/avatar/" + this.state.user.avatar}} />
                    </View>
                  </Body>
                </CardItem>
                <CardItem bordered>
                  <Left>
                    <Icon
                      name="ios-person"
                      style={{ color: "#454545" }}
                    />
                    <Text>{this.state.user.name}</Text>
                  </Left>
                </CardItem>
                <CardItem bordered>
                  <Left>
                    <Icon
                      name="md-bowtie"
                      style={{ color: "#454545" }}
                    />
                    <Text>{this.state.user.title}</Text>
                  </Left>
                </CardItem>
                <CardItem bordered>
                  <Left>
                    <Icon
                      name="md-mail"
                      style={{ color: "#454545" }}
                    />
                    <Text>{this.state.user.email}</Text>
                  </Left>
                </CardItem>
                <CardItem bordered>
                  <Left>
                    <Icon
                      name='ios-list-box'
                      style={{ color: "#454545",position: 'absolute' ,top: 0,marginRight: 15  }}
                    />
                    <Text>{this.state.user.about} </Text>
                  </Left>
                </CardItem>
                
              </Card>
            </Content>
            <Content padder>
              <Card>
                <CardItem style={styles.head}>
                  <Text style={styles.h1}> Skills</Text>
                </CardItem>
                <CardItem>
                  <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                    <Button style={styles.tags} dark><Text> Dark asasdas </Text></Button>  
                    <Button style={styles.tags} dark><Text> Dark </Text></Button>
                    <Button style={styles.tags} dark><Text> Dark </Text></Button>
                    <Button style={styles.tags} dark><Text> Dark </Text></Button>
                    <Button style={styles.tags} dark><Text> Dark </Text></Button>
                  </View>
                </CardItem>

              </Card>
            </Content>  
              
          
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  
  bar :{
   backgroundColor: '#f44336',
   flexDirection: 'row',
   elevation: 3,
  },
  barItem :{
   flex: 1,
   padding: 20,
   alignItems: 'center',
  },
  barTop :{
   color: '#fff',
   fontSize: 14,
   fontWeight: 'bold',
   fontStyle: 'italic' 
  },
  barBottom :{
   color: '#ccc',
   fontSize: 16,
   fontWeight: 'bold',
  },
  profilePicWrap:{
    width: 90,
    height: 90,
    borderColor: '#f44336',
    backgroundColor: '#292929',
    borderWidth: 5,
    borderRadius: 100,
    alignContent: 'center',
    elevation: 25
  },
  profilePic:{
    flex:1,
    width: null,
    alignSelf: 'stretch',
  },
  name:{
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
  },
  data:{
    fontSize: 14,
    color: '#ccc'
  }, 
  head:{
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: '#f44336',
    borderBottomWidth: 2,
  },
  h1 :{
    color: '#080808',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  tags:{
    margin: 5,
    elevation: 10,
    minWidth: '33%',
    backgroundColor: '#f44336',
  }
  
});