 import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  NetInfo,
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
  Badge,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { LoadingComponent, Toast } from '../../components';
import Tag from "../../components/inputtag/Tag";
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';


export default class ProposalInfo extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      proposal: this.props.proposal
    }
  }

  selectProposal = () => {

    const {proposal} = this.state;

    NetInfo.isConnected.fetch().then((isConnected) => {

      if(isConnected) {

        timeout(10000, 
          fetch(baseurl + '/task/proposal/' + this.props.taskid, {
              method : 'put',
              headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
              },
              body: JSON.stringify({
                userid: proposal.user._id
              })
          })
          .then((response) => response.json())
          .then((res) => {
            if(res.status == 200) {
            
              alert(res.message)
              Actions.generatedtasks();

            } else {
              if(res.status == 404) {

                alert(res.message)
              } else {
                alert("Error Selecting Proposal");
              }
            }       
          })
          .catch((error) => {
            console.log(error)
            alert("Some Error Occured");
          })
        ).catch((error) => {

            alert("Server not responding.");
        });

      } else {
        Toast.show({text: 'No Internet Connection!',
          textColor: '#cccccc',
          duration: 10000
        });
      }
    });    
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
            <Title style={{ color: "#FFF" }}>Proposal  Info...</Title>
          </Body>
          <Right>
            
            <Button style={styles.tags} transparent onPress={() => this.selectProposal()}>
              <Text style={{ color: "#FFF",fontSize: 16,alignItems:  'center' }}>
                <Icon name="paper-plane" style={{ color: "#FFF",fontSize: 18,alignItems:  'center' }} />
                Apply 
              </Text>
            </Button>
          </Right>  
        </Header>
        <Content >
          <Card>
            <CardItem style={styles.hr}>
              <Title style={styles.h1}>{this.state.proposal.user.name}</Title>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Icon
                  name='ios-time'
                  style={{ color: "#ccc",margin: 5,alignSelf: 'center'}}
                />
                <Text note> {new Date(this.state.proposal.createdAt).toDateString()}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Text style={{textAlign:  'justify' }}> 
                {this.state.proposal.description}
              </Text>
            </CardItem>
          </Card>
          <Card style={{ elevation: 3}}>
            <CardItem style={styles.hr}>
              <Title style={styles.h1}> Submitted By :</Title>
            </CardItem>
            <CardItem bordered>
              <Left style={{alignItems: 'center',}}>
                <View style={styles.profilePicWrap} >
                    <Image style={styles.profilePic}  source={{uri: baseurl + "/uploads/avatar/" + this.state.proposal.user.avatar}} />
                </View>
              </Left>
              <Body>
                    <Text>{this.state.proposal.title}</Text>
                    <Title style={styles.h1}>{this.state.proposal.user.name} </Title>
                    <Text note>{this.state.proposal.user.level}</Text>
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
    