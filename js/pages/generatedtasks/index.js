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
  Spinner
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
      page: 1,
      showLoadingScreen: true,
      loadingComponent: {
        internet: true,
        hasData: true
      },
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
                tasks: res.data.tasks,
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

              this.setState({
                showLoadingScreen: false
              });
          })
        ).catch((error) => {

            alert("Server not responding.");
            this.setState({
                showLoadingScreen: false
              });
        });

      } else {
        this.setState({
          loadingComponent: { ...this.state.loadingComponent, internet: false} 
        });
      }
    });
  }

  loadMoreTasks = () => {

    const {page} = this.state;
    url = `${baseurl}/task/user/${User.get()._id}?page=${page}`;

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
                alert(res.data);
                this.setState({
                  isLoading: false
                });
              }              
            }       
          })
          .catch((error) => {
              alert(error);

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
        page: 1,
        showLoadingScreen: true,
        loadingComponent: Object.assign(this.state.loadingComponent, { internet: true, hasData: true })
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
              <Title style={{ color: "#F2F2F2" }}>Generated Tasks</Title>
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
          <View style={{flex: 1}}>
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
                        {item.status == 0 ? (
                          <Button danger style={{padding: 8}}  onPress={() => Actions.proposals({task: item})}>
                            <Text>Applicants</Text>
                            <TouchableHighlight>
                              <Badge success>
                                <Text>{item.proposals.length}</Text>
                              </Badge>
                            </TouchableHighlight>
                          </Button>
                        ) : (
                          <Button danger style={{padding: 8}}  onPress={() => Actions.profile({userid: item.task_taker})}>
                            <Text>View Task Taker</Text>
                          </Button>
                        )}
                      </Right>
                     </CardItem>
                     
                   </Card> 
                }
                ListFooterComponent={this.renderFooter}
                onRefresh={this.handleRefresh}
                refreshing={this.state.showLoadingScreen}
                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={0.25}
              />
            
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