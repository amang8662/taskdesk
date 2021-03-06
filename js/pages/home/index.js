import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  NetInfo,
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
  Spinner
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { LoadingView, Toast } from '../../components';
import Tag from "../../components/inputtag/Tag";
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';

export default class Home extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      page: 1,
      status: 100,
      isLoading: false
    }
  }

  componentDidMount() {
    this.getTasks()
  }

  getTasks = () => {

    NetInfo.isConnected.fetch().then((isConnected) => {

      if(isConnected) {

        timeout(10000, 
          fetch(baseurl + '/task/all/except/user/' + User.get()._id, {
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
                tasks: res.data.tasks,
                status: 200
              });

            } else {
              if(res.status == 404) {

                this.setState({
                  status: res.status
                });
              } else {
                alert(res.message);
                this.setState({
                  status: res.status
                });
              }  
            }       
          })
          .catch((error) => {
              this.setState({
                status: 500
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

  loadMoreTasks = () => {

    const {page} = this.state;
    url = `${baseurl}/task/all/except/user/${User.get()._id}?page=${page}`;

    NetInfo.isConnected.fetch().then((isConnected) => {

      if(isConnected) {

        this.setState({
          isLoading: true
        });

        timeout(10000, 
          fetch(url, {
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
                tasks: [...this.state.tasks, ...res.data.tasks],
                isLoading: false
              });

            } else {
              if(res.status == 404) {

                this.setState({
                  isLoading: false
                });
              } else {
                alert(res.message);
                this.setState({
                  isLoading: false
                });
              }              
            }       
          })
          .catch((error) => {
              console.log(error);

              this.setState({
                isLoading: false
              });
          })
        ).catch((error) => {

            alert("Server not responding.");
            this.setState({
              isLoading: false
            });
        });

      } else {
        Toast.show({text: 'No Internet Connection!',
          textColor: '#cccccc',
          duration: 10000
        });
      }
    });
  }

  renderFooter = () => {
    
    return this.state.isLoading ?  (
      <View>
        <Spinner size={25} color='#dc4239' />
      </View>
    ) : null;
  };

  handleRefresh = () => {
    this.setState(
      {
        tasks: [],
        page: 1,
        status: 100
      },
      () => {
        this.getTasks();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.loadMoreTasks();
      }
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
          <Left>
            <Button transparent onPress={() => Actions.drawerOpen()}>
              <Icon name="md-menu" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#F2F2F2" }}> TaskDesk</Title>
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
        <View style={{flex:1}}>
          <LoadingView status={this.state.status}>        
            <FlatList
              data={this.state.tasks}
              keyExtractor={item => item._id}
              renderItem={({item}) => 
                <Card>
                   <CardItem bordered style={styles.hr}>
                     <Left>
                         <Title style={styles.h1}>{item.title}</Title>                         
                     </Left>
                   </CardItem>
                   <CardItem>
                     <Body>
                       <Text numberOfLines = { 3 } style={{textAlign:  'justify' }}>
                        {item.description}
                       </Text>
                     </Body>
                   </CardItem>
                   <CardItem>
                        <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                          {item.skills.map((tag, i) => (
                            <Button style={styles.tags}  key={i}><Text> {tag.name}</Text></Button>
                          ))}
                        </View>
                   </CardItem>
                   <CardItem>
                     <Left>
                       <Button transparent>
                         <Text note>Created At : {new Date(item.createdAt).toDateString()}</Text>
                       </Button>
                     </Left>
                     <Right>
                        <View style={{ alignSelf:  'center',}}>
                          <Text>Reward</Text>
                          <Text style={{fontSize: 24,color: '#f44336',textAlign: 'right' }}>Rs. {item.payment}</Text>
                        </View>
                     </Right>
                   </CardItem>
                   <CardItem>
                      <View style={{width: '100%'}} >
                        <Button danger full onPress={() => Actions.taskinfo({task: item, canApply: true})}>
                          <Text>View Details</Text>
                         <Right>
                          <Button danger>
                            <Icon name="md-arrow-forward" style={{ color: "#fcfcfc",fontSize: 32 }} />
                          </Button>
                         </Right>
                        </Button>
                      </View>
                  </CardItem>
                </Card> 
                }
                ListFooterComponent={this.renderFooter}
                onRefresh={this.handleRefresh}
                refreshing={this.state.status == 100 ? true: false}
                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={0.25}
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