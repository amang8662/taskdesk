 import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  NetInfo,
  ToastAndroid
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
import { LoadingView } from '../../components';
import Tag from "../../components/inputtag/Tag";
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';

export default class Proposals extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      proposals: [],
      status: 100
    }
  }

  componentDidMount() {

    NetInfo.isConnected.fetch().then((isConnected) => {

      if(isConnected) {

        timeout(10000, 
          fetch(baseurl + '/task/proposal/' + this.props.task._id, {
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
                proposals: res.data,
                status: 200
              });

            } else {
              if(res.status == 404) {

                this.setState({ 
                  status: res.status
                });
              } else {
                alert(res.data);
                this.setState({
                  status: res.status
                });
              }
            }       
          })
          .catch((error) => {
              this.setState({
                status: 505
              });
          })
        ).catch((error) => {
          this.setState({
              status: 408
            });
        });

      } else {
        this.setState({
          status: 150
        });
      }
    });
  }

  render() {
    
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#F2F2F2" }}>Task Proposals</Title>
          </Body>
        </Header>
        <View style={{flex: 1}}>
          <LoadingView status={this.state.status}>
            <FlatList
            data={this.state.proposals}
            keyExtractor={item => item._id}
            renderItem={({item}) => 
              <Card >
                 <CardItem bordered style={styles.hr}>
                   <Left>
                       <Title style={styles.h1}>{item.user.name}</Title>                         
                   </Left>
                   <Right>
                      <Text note>{item.user.title}</Text>
                   </Right>
                   
                 </CardItem>

                 <CardItem>
                   <Body>
                     
                     <Text numberOfLines = { 3 }  style={{textAlign:  'justify' }}>
                      {item.description}
                     </Text>
                   </Body>
                 </CardItem>
                 <CardItem>
                   <Left>
                     <Button transparent>
                       <Text note>Created At : {new Date(item.createdAt).toDateString()}</Text>
                     </Button>
                   </Left>
                 </CardItem>
                 <CardItem>
                  <Left>
                    <Button danger  onPress={() => Actions.proposalinfo({proposal: item, taskid: this.props.task._id})}>
                      <Text>View Details</Text>
                      
                    </Button>
                  </Left>
                 </CardItem>
                 
               </Card> 
              }
            />
          </LoadingView>
        </View>
      </Container>        
    );
  }
}

const styles = StyleSheet.create({
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
    fontSize: 24,
  },
  tags:{
    margin: 5,
    elevation: 10,
    minWidth: '10%',
    height: 30,
    backgroundColor: '#f44336',
  }
});