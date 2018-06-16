 import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  NetInfo,
  ToastAndroid,
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
import { LoadingComponent } from '../../components';
import Tag from "../../components/inputtag/Tag";
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';


export default class ProposalInfo extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      proposal: {},
      showLoadingScreen: true,
      loadingComponent: {
        internet: true,
        hasData: true
      }
    }
  }

  componentDidMount() {

    NetInfo.isConnected.fetch().then((isConnected) => {

      if(isConnected) {

        timeout(10000, 
          fetch(baseurl + '/proposal/' + this.props.proposal._id, {
              method : 'get',
              headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
              }
          })
          .then((response) => response.json())
          .then((res) => {
            if(res.status == 200) {
            
              this.setState({
                proposal: res.data,
                showLoadingScreen: false
              });

            } else {
              if(res.status == 404) {

                this.setState({ 
                  loadingComponent: { ...this.state.loadingComponent, hasData: false} 
                });
              } else {
                alert(res.data);
                this.setState({
                  showLoadingScreen: false
                });
              }
            }       
          })
          .catch((error) => {
              alert(error);
          })
        ).catch((error) => {

            alert("Server not responding.");
        });

      } else {
        this.setState({
          loadingComponent: { ...this.state.loadingComponent, internet: false} 
        });
      }
    });
  }

  render() {
    if(this.state.showLoadingScreen == true)
      return (
        <LoadingComponent internet={this.state.loadingComponent.internet} hasData={this.state.loadingComponent.hasData} />
      );
    else
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
            {/*<Right>
              
              <Button style={styles.tags} transparent >
                <Text style={{ color: "#FFF",fontSize: 16,alignItems:  'center' }}>
                  <Icon name="paper-plane" style={{ color: "#FFF",fontSize: 18,alignItems:  'center' }} />
                  Apply 
                </Text>
              </Button>
            </Right>*/}  
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
    