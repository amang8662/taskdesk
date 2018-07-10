 import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  FlatList,
  NetInfo,
  ToastAndroid
} from 'react-native';
import {
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
  Spinner,
  Tab
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { LoadingView, Toast } from '../../components';
import Tag from "../../components/inputtag/Tag";
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';
import { styles } from "./styles";

export default class CompletedList extends Component<{}> {

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

    const {page} = this.state;
    url = `${baseurl}/task/user/${User.get()._id}?taskstatus=3`;

    NetInfo.isConnected.fetch().then((isConnected) => {

      if(isConnected) {

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
                tasks: res.data.tasks,
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

  loadMoreTasks = () => {

    const {page} = this.state;
    url = `${baseurl}/task/user/${User.get()._id}?taskstatus=3&page=${page}`;

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
      <LoadingView status={this.state.status}>
        <FlatList
          data={this.state.tasks}
          keyExtractor={item => item._id}
          renderItem={({item}) => 
            <Card >
             <CardItem bordered style={styles.hr}>
               <Left>
                   <Title style={styles.h1}>{item.title}</Title>                         
               </Left>
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
                  <Text style={{fontSize: 24,color: '#f44336'}}>Rs. {item.payment}</Text>
                </View>
               </Right>
             </CardItem>
              <CardItem>
                <View style={{width: '100%'}} >
                  <Button danger full onPress={() => Actions.taskinfo({task: item})}>
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
    );
  }
}