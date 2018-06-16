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
import { LoadingComponent } from '../../components';
import Tag from "../../components/inputtag/Tag";
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';

export default class GeneratedTasks extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
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
          fetch(baseurl + '/task/user/' + User.get()._id, {
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
                tasks: res.data,
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
          <Header style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
            <Left>
              <Button transparent onPress={() => Actions.drawerOpen()}>
                <Icon name="md-menu" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: "#F2F2F2" }}>Genrated Tasks</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => Actions.profile()}>
                <Icon name="md-contact" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
              </Button>
              <Button transparent onPress={() => Actions.addtask()}>
                <Icon name="md-add" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
              </Button>
            </Right>
          </Header>
          <Content>
              <FlatList
              data={this.state.tasks}
              keyExtractor={item => item._id}
              renderItem={({item}) => 
                <Card >
                     <CardItem bordered style={styles.hr}>
                       <Left>
                           <Title style={styles.h1}>{item.title}</Title>                         
                       </Left>
                       <Right>
                          <TouchableHighlight onPress={() => Actions.edittask({task: item})} >
                            <Icon name="settings" style={{ color: "#474747",fontSize: 32 }} />
                          </TouchableHighlight> 
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
                          <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                            {item.skills.map((tag, i) => (
                              <Button style={styles.tags}  dark key={i}><Text> {tag.name}</Text></Button>
                            ))} 
                          </View>
                     </CardItem>
                     <CardItem>
                       <Left>
                         <Button transparent>
                           <Text note>Created At : {new Date(item.createdAt).toDateString()}</Text>
                         </Button>
                       </Left>
                       <Right >
                        <View style={{ alignSelf:  'center',}}>
                          <Text>Reward</Text>
                          <Text style={{fontSize: 24,color: '#f44336'}}>{item.rewardscore}</Text>
                        </View>
                       </Right>
                     </CardItem>
                     <CardItem>
                      <Left>
                        <Button danger  onPress={() => Actions.taskinfo({task: item})}>
                          <Text>View Details</Text>
                          
                        </Button>
                      </Left>
                      <Right>
                        <Button danger style={{padding: 8}}>
                          <Text>Applicants</Text>
                          <TouchableHighlight  >
                            <Badge success>
                              <Text>200</Text>
                            </Badge>
                          </TouchableHighlight>
                        </Button>
                      </Right>
                     </CardItem>
                     
                   </Card> 
                }
              />
            
          </Content>
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