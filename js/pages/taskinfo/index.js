import React, { Component } from 'react';
import {
  StyleSheet,
  View,
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
  Text,
  Card,
  CardItem,
} from 'native-base';

import { Actions } from 'react-native-router-flux';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';


export default class TaskInfo extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      user: User.get()
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header  style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
          <Left>
            <Button transparent onPress={() => Actions.home()}>
              <Icon name="arrow-back" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#FFF" }}>Task  Info...</Title>
          </Body>
          <Right>
            
            <Button style={styles.tags} transparent >
              <Text style={{ color: "#FFF",fontSize: 16,alignItems:  'center' }}>
                <Icon name="paper-plane" style={{ color: "#FFF",fontSize: 18,alignItems:  'center' }} />
                Apply 
              </Text>
            </Button>
          </Right>
        </Header>
        <Content>
            <Content padder >
              <Card style={{ elevation: 3}}>
                <CardItem bordered>
                  <Left style={{alignItems: 'center',}}>
                    <View style={styles.profilePicWrap} >
                        <Image style={styles.profilePic}  source={{uri: baseurl + "/uploads/avatar/" + this.state.user.avatar}} />
                    </View>
                  </Left>
                  <Body>
                        <Text>{this.state.user.title}asd</Text>
                        <Title style={styles.h1}>{this.state.user.name} kjckhcgkc</Title>
                        <Text note>{this.state.user.level}122</Text>
                  </Body>
                </CardItem>
              </Card>
            </Content>

            <Content padder>

              <Card>
                  <View style={{ alignSelf:  'center',   padding: 20}}>
                    <Text style={styles.h1}>Reward</Text>
                    <Text style={{fontSize: 30,color: '#f44336'}}>$40</Text>
                  </View>
                
              </Card>
            </Content>
            <Content padder>
              <Card>
                <CardItem style={styles.hr}>
                  <Title style={styles.h1}>{this.state.user.title}asd</Title>
                </CardItem>
                <CardItem bordered>
                  <Left>
                    <Icon
                      name='ios-time'
                      style={{ color: "#ccc",margin: 5,alignSelf: 'center'}}
                    />
                    <Text note> {this.state.user.timestamp}22:22:22 sgsg </Text>
                  </Left>
                </CardItem>
                <CardItem>
                  <Text> asdasdafSeparator component is a separator usually used in list, which can be used for grouping list items. Though it is used with List, you can use it anywhere in your app.

Replacing Component: React Native View
                  </Text>
                </CardItem>
                <CardItem>
                  <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                    <Button style={styles.tags} dark><Text> Dark asasdas </Text></Button>  
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
    elevation: 30
  },
  profilePic:{
    flex:1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 100,
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
  hr:{
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: '#f44336',
    borderBottomWidth: 2,
  },
  h1 :{
    color: '#080808',
    fontStyle: 'italic' ,
  },
  tags:{
    margin: 5,
    elevation: 10,
    minWidth: '33%',
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 0
  }
  
});
    