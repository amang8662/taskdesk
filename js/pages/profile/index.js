import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  NetInfo,
  TouchableOpacity
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
import { LoadingComponent } from '../../components';
import { timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';

export default class Profile extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      userid: this.props.userid ? this.props.userid : User.get()._id,
      user: {},
      foreignUser: this.props.userid ? true : false,
      showLoadingScreen: true,
      loadingComponent: {
        internet: true,
        hasData: true
      }
    }
  }

  componentDidMount() {

    const {userid} = this.state;

    if(this.state.foreignUser == true) {

      NetInfo.isConnected.fetch().then((isConnected) => {

        if(isConnected) {

          timeout(10000, 
            fetch(baseurl + '/user/' + userid, {
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
                  user: res.data,
                  showLoadingScreen: false
                });

              } else {
                if(res.status == 404) {

                  this.setState({ 
                    loadingComponent: { ...this.state.loadingComponent, hasData: false} 
                  });
                } else {
                  alert(res.data);
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
    } else {
      this.setState({
        user: User.get(),
        showLoadingScreen: false
      })
    }
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
              <Button transparent onPress={() => Actions.drawerOpen()}>
                <Icon name="md-menu" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: "#FFF" }}>{this.state.user.username}</Title>
            </Body>
            {this.state.foreignUser == false ? (
              <Right>            
                <Button transparent onPress={() => Actions.editprofile()}>
                  <Icon name="settings" style={{ color: "#FFF",fontSize: 30,alignItems:  'center' }} />
                </Button>
              </Right>
            ): null}
          </Header>
          <Content>
              <View style={styles.bar} >

                  <View style={styles.barItem }>
                    
                    <Text style={styles.barTop}> Score</Text>
                    <Text style={styles.barBottom}>{this.state.user.score}</Text>

                  </View>
                  <View style={styles.barItem}>
                    
                    <Text style={styles.barTop}> Level</Text>
                    <Text style={styles.barBottom}>{this.state.user.level}</Text>

                  </View>
              </View>
            
              <Card>
                <CardItem bordered>
                  <Body style={{alignItems: 'center',}}>
                    <View style={styles.profilePicWrap} >
                        <Image style={styles.profilePic}  source={{uri: baseurl + "/uploads/avatar/" + this.state.user.avatar}} />
                    </View>
                  </Body>
                </CardItem>
                <CardItem bordered>
                  <Left>
                    <Icon
                      name="ios-person"
                      style={{ color: "#454545" }}
                    />
                    <Text>{this.state.user.name}</Text>
                  </Left>
                </CardItem>
                {this.state.user.title ? (
                  <CardItem bordered>
                    <Left>
                      <Icon
                        name="md-bowtie"
                        style={{ color: "#454545" }}
                      />
                      <Text>{this.state.user.title}</Text>
                    </Left>
                  </CardItem>
                ) : null}
                <CardItem bordered>
                  <Left>
                    <Icon
                      name="md-mail"
                      style={{ color: "#454545" }}
                    />
                    <Text>{this.state.user.email}</Text>
                  </Left>
                </CardItem>
                <CardItem bordered>
                  <Left>
                    <Icon
                      name='ios-list-box'
                      style={{ color: "#454545" }}
                    />
                    <Text>{this.state.user.about} </Text>
                  </Left>
                </CardItem>  
              </Card>
            
              <Card>
                <CardItem style={styles.hr}>
                  <Title style={styles.h1}> Skills</Title>
                </CardItem>
                <CardItem>
                  <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                    {this.state.user.skills.length > 0 ? (
                      this.state.user.skills.map((tag, i) => (
                          <Button style={styles.tags}  dark key={i}><Text> {tag.name}</Text></Button>
                        )
                      )) : (
                      <Text>No Skills Found</Text>
                    )}
                  </View>
                </CardItem>
              </Card>            
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
  }
  
});