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
      tasks: {},
      canApply: this.props.canApply ? this.props.canApply : false,
      showLoadingScreen: true,
      loadingComponent: {
        internet: true,
        hasData: true
      }
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header  style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#FFF" }}>Task  Info...</Title>
          </Body>
          {this.state.canApply == true ? (
            <Right>
              
              <Button style={styles.tags} transparent >
                <Text style={{ color: "#FFF",fontSize: 16,alignItems:  'center' }}>
                  <Icon name="paper-plane" style={{ color: "#FFF",fontSize: 18,alignItems:  'center' }} />
                  Apply 
                </Text>
              </Button>
            </Right>
          ) : null}
        </Header>
        <Content >
          <Card>
            <CardItem style={styles.hr}>
              <Title style={styles.h1}>{this.props.task.title}</Title>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Icon
                  name='ios-time'
                  style={{ color: "#ccc",margin: 5,alignSelf: 'center'}}
                />
                <Text note> {new Date(this.props.task.createdAt).toDateString()}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Text style={{textAlign:  'justify' }}> 
                {this.props.task.description}
              </Text>
            </CardItem>
            <CardItem>
              <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
               {this.props.task.skills.map((tag, i) => (
                 <Button style={styles.tags}  key={i}><Text> {tag.name}</Text></Button>
               ))}
              </View>
            </CardItem>

          </Card>
          <Card>
              <View style={{ alignSelf:  'center',   padding: 20}}>
                <Text style={styles.h1}>Reward</Text>
                <Text style={{fontSize: 30,color: '#f44336'}}>{this.props.task.rewardscore}</Text>
              </View>
            
          </Card>
          <Card style={{ elevation: 3}}>
            <CardItem style={styles.hr}>
              <Title style={styles.h1}> Submitted By :</Title>
            </CardItem>
            <CardItem bordered>
              <Left style={{alignItems: 'center',}}>
                <View style={styles.profilePicWrap} >
                    <Image style={styles.profilePic}  source={{uri: baseurl + "/uploads/avatar/" + this.props.task.task_creater.avatar}} />
                </View>
              </Left>
              <Body>
                    <Text>{this.props.task.title}</Text>
                    <Title style={styles.h1}>{this.props.task.task_creater.name} </Title>
                    <Text note>{this.props.task.task_creater.level}</Text>
              </Body>
            </CardItem>
          </Card>
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
    