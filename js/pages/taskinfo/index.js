import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Modal,
  NetInfo
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
  Form, Item, Input,Label,
} from 'native-base';

import { InputText, TextInputError, InputTag, Toast } from '../../components';
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { Spinner } from 'native-base';
import { baseurl } from '../../Globals';
import { Actions } from 'react-native-router-flux';


export default class TaskInfo extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      task: this.props.task,
      description: '',
      descriptionError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      canApply: this.props.canApply ? this.props.canApply : false,
      modalVisible: false,
      isLoading: false
    }
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidMount() {
    if(this.state.canApply == true) {
      const userid = User.get()._id;
      let data = this.state.task.proposals.filter((proposal,index) => proposal.user == userid);
      if(data.length > 0) {
        // Person has Applied
        this.setState({
          canApply: false
        })
      }
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  validateForm() {

    //Check Description
    const descriptionError = validate("description",this.state.description,{required:true});
    
    this.setState({
      descriptionError: Object.assign(this.state.descriptionError, descriptionError)
    })

    if(this.state.descriptionError.isError) {
      return false;
    } else {
      return true;
    }
  }

  apply = () => {
    const {description} = this.state;

    const isFormValid = this.validateForm();
    
    if(isFormValid) {
      
      NetInfo.isConnected.fetch().then((isConnected) => {

        this.setState({
          isLoading: true
        });

        if(isConnected) {

          let userdata = User.get();

          timeout(10000, 
            fetch(baseurl + '/task/proposal/' + this.state.task._id, {
                method : 'post',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
                },
                'body' : JSON.stringify({
                  userid : User.get()._id,
                  description : description
                })
            })
            .then((response) => response.json())
            .then((res) => {
              
              this.setState({
                isLoading: false
              });

              if(res.status == 200) {
              
                alert(res.message);

                this.setState({
                  modalVisible: false,
                  canApply: false
                });
              } else {

                if(res.status == 400) {
                  console.log(res.data);
                  alert(res.message);
                }
                else {
                  alert(res.message);
                }    
              }       
            })
            .catch((error) => {
                console.log(error);
                alert('Some Error Occured');
                this.setState({
                  isLoading: false
                });
            })
          ).catch((error) => {

              this.setState({
                isLoading: false
              });

              alert("Server not responding. Try again");
          });

        } else {
          Toast.show({text: 'No Internet Connection!',
            textColor: '#cccccc',
            duration: 10000});
        }
      });
    }
  }


  render() {
    return (
      <Container style={styles.container}>
        <Header  style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content">
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
              
              <Button style={styles.tags} transparent onPress={() => {
                  this.setModalVisible(true);
                }}>
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
              <Title style={styles.h1}>{this.state.task.title}</Title>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Icon
                  name='ios-time'
                  style={{ color: "#ccc",margin: 5,alignSelf: 'center'}}
                />
                <Text note> {new Date(this.state.task.createdAt).toDateString()}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Text style={{textAlign:  'justify' }}> 
                {this.state.task.description}
              </Text>
            </CardItem>
            <CardItem>
              <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
               {this.state.task.skills.map((tag, i) => (
                 <Button style={styles.tags}  key={i}><Text> {tag.name}</Text></Button>
               ))}
              </View>
            </CardItem>

          </Card>
          <Card>
              <View style={{ alignSelf:  'center',   padding: 20}}>
                <Text style={styles.h1}>Reward</Text>
                <Text style={{fontSize: 30,color: '#f44336'}}>Rs. {this.state.task.payment}</Text>
              </View>
            
          </Card>
          <Card style={{ elevation: 3}}>
            <CardItem style={styles.hr}>
              <Title style={styles.h1}> Submitted By :</Title>
            </CardItem>
            <CardItem bordered>
              <Left style={{alignItems: 'center',}}>
                <View style={styles.profilePicWrap} >
                    <Image style={styles.profilePic}  source={{uri: baseurl + "/uploads/avatar/" + this.state.task.task_creater.avatar}} />
                </View>
              </Left>
              <Body>
                    <Text>{this.state.task.task_creater.title}</Text>
                    <Title style={styles.h1}>{this.state.task.task_creater.name} </Title>
                    <Text note>{this.state.task.task_creater.level}</Text>
              </Body>
            </CardItem>
          </Card>
          <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}>
            <Header style={{ backgroundColor: "#dc4239" }}  androidStatusBarColor="#dc2015" iosBarStyle="light-content">
              <Left>
                <Button transparent onPress={() => this.setModalVisible(false)}>
                  <Icon name="arrow-back" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
                </Button>
              </Left>
              <Body>
                <Title style={{ color: "#FFF" }}>Apply for Task</Title>
              </Body>
            </Header>
            <Form>
              <Item stackedLabel >
                <Label>Description</Label>
                <InputText
                    multiline={true}
                    numberOfLines={3}
                    isError={this.state.descriptionError.isError} 
                    value={this.state.description}
                    onChangeText={description => this.setState({description})}
                    inputRef={(input) => this.description = input}
                    returnKeyType={'done'}
                    onBlur={() => {
                        descriptionError = validate("description",this.state.description,{required:true})
                        this.setState({
                          descriptionError: Object.assign(this.state.descriptionError, descriptionError)
                        })
                      }}
                    />
                <TextInputError isError={this.state.descriptionError.isError} message={this.state.descriptionError.message} /> 
              </Item>
              <Button block style={{ margin: 15, marginTop: 50,backgroundColor: '#369' }} onPress={this.apply}>
                  <Label style={{color: '#fff'}} >Apply</Label>
              </Button>
              { this.state.isLoading == true ? <Spinner color='#d7d4f0' /> : null}
            </Form>
          </Modal>
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
    