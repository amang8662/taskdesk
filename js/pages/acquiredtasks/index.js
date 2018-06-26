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
  Tab,
  Tabs,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { LoadingComponent } from '../../components';
import Tag from "../../components/inputtag/Tag";
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';

export default class AcquiredTasks extends Component<{}> {

 constructor(props) {
    super(props);
    this.state = {
      applied: [],
      working: [],
      completed: [],
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
          fetch(baseurl + '/task/aquired/user/' + User.get()._id, {
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
                applied: res.data.filter((applied,index) => applied.status == 0),
                working: res.data.filter((working,index) => working.status == 1 || working.status == 2),
                completed: res.data.filter((completed,index) => completed.status == 3),
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

  submitTask = (taskid) => {

    NetInfo.isConnected.fetch().then((isConnected) => {

      if(isConnected) {

        timeout(10000, 
          fetch(baseurl + '/task/submit/' + taskid, {
              method : 'put',
              headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
              }
          })
          .then((response) => response.json())
          .then((res) => {
            
            if(res.status == 200) {
              this.setState({
                working: this.state.working.map(
                    (el)=> el._id === taskid ? Object.assign({}, el, {status: 2}) : el 
                  )
              },
                () => alert(res.data)
              );

            } else {
              alert(res.data)         
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
        <Header hasTabs style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
          <Left>
            <Button transparent onPress={() => Actions.drawerOpen()}>
              <Icon name="md-menu" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#F2F2F2" }}> Acquired Tasks</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => Actions.profile()}>
              <Icon name="md-contact" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Right>
        </Header>
        <Tabs initialPage={0} >
          <Tab heading="Applied" page 
              tabStyle={{backgroundColor: '#f44336'}}
              textStyle={{color: '#fff'}} 
              activeTabStyle={{backgroundColor: '#f44336'}}
              activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
              {this.state.applied.length > 0 ? (
                <Content>
                  <FlatList
                  data={this.state.applied}
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
                  />
                </Content>
              ) : (
                <LoadingComponent internet={this.state.loadingComponent.internet} hasData={false} />
              )}
          </Tab>
          <Tab heading="Working"
          tabStyle={{backgroundColor: '#f44336'}}
              textStyle={{color: '#fff'}} 
              activeTabStyle={{backgroundColor: '#f44336'}}
              activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
              {this.state.working.length > 0 ? (
                <Content>
                  <FlatList
                  data={this.state.working}
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
                        <Left>
                          <Button danger onPress={() => Actions.taskinfo({task: item})}>
                            <Text>View Details</Text>
                          </Button>
                        </Left>
                        <Right>
                        {item.status == 1 ? (
                          <Button danger onPress={() => this.submitTask(item._id)}>
                            <Text>Submit</Text>
                            <Icon name="paper-plane" style={{ color: "#fcfcfc",fontSize: 32 }} />
                          </Button>
                        ) : (
                          <Button danger>
                            <Text>Waiting Approval</Text>
                          </Button>
                        )}
                        </Right>
                      </CardItem>
                    </Card> 
                    }
                  />
                </Content>
              ) : (
                <LoadingComponent internet={this.state.loadingComponent.internet} hasData={false} />
              )}
          </Tab>
          <Tab heading="Completed" page
          tabStyle={{backgroundColor: '#f44336'}}
              textStyle={{color: '#fff'}} 
              activeTabStyle={{backgroundColor: '#f44336'}}
              activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
              {this.state.completed.length > 0 ? (
                <Content>
                  <FlatList
                  data={this.state.completed}
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
                  />
                </Content>
              ) : (
                <LoadingComponent internet={this.state.loadingComponent.internet} hasData={false} />
              )}
          </Tab>
        </Tabs>
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