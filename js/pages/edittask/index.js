import React, { Component } from 'react';
import {
  StyleSheet,
  AsyncStorage,
  NetInfo,
  ToastAndroid,
  Text,
  Alert,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Body,
  Left,
  Right,
  Form, Item, Input,Label,
} from 'native-base';

import { InputText, TextInputError, InputTag } from '../../components';
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { Spinner } from 'native-base';
import { baseurl } from '../../Globals';
import { Actions } from 'react-native-router-flux';



export default class EditTask extends Component<{}> {

  constructor(props) {
    super(props);
    console.log(this.props.task);
    this.state = {
      taskId: this.props.task._id,
      title: this.props.task.title,
      titleError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      description: this.props.task.description,
      descriptionError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      payment: this.props.task.payment | 0,
      paymentError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      tags: this.props.task.skills,
      tagError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      showLoadingScreen: false,
      isLoading: false,
      clearTagList: false
    };
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  handleFirstConnectivityChange(isConnected) {
    if(isConnected) {
      ToastAndroid.show('Connection Established', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('No Internet Connection!', ToastAndroid.SHORT);
    }
  }

  validateForm() {

    //Check Title
    const titleError = validate("title",this.state.title,{required:true});
   
    this.setState({
      titleError: Object.assign(this.state.titleError, titleError)
    })

    //Check Description
    const descriptionError = validate("description",this.state.description,{required:true});
    
    this.setState({
      descriptionError: Object.assign(this.state.descriptionError, descriptionError)
    })

    //Check Payment
    const paymentError = validate("payment",Number(this.state.payment),{required:true, integer: true});
    
    this.setState({
      paymentError: Object.assign(this.state.paymentError, paymentError)
    })

    //Check tag
    const tagError = validate("tag",this.state.tags,{required:true,type: 'array'});
    
    this.setState({
      tagError: Object.assign(this.state.tagError, tagError)
    })

    if(this.state.titleError.isError || this.state.descriptionError.isError|| this.state.paymentError.isError|| this.state.tagError.isError) {
      return false;
    } else {
      return true;
    }
  }

  updateTask = () => {
    const {title, description, payment, tags} = this.state;

    let tagArr = [];
    tags.forEach(function(tag) {
      tagArr.push(tag._id);
    });

    const isFormValid = this.validateForm();
    
    if(isFormValid) {
      
      NetInfo.isConnected.fetch().then((isConnected) => {

        this.setState({
          isLoading: true
        });

        if(isConnected) {

          let userdata = User.get();

          timeout(10000, 
            fetch(baseurl + '/task/' + this.state.taskId , {
                method : 'put',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
                },
                'body' : JSON.stringify({
                  title : title,
                  description : description,
                  payment : Number(payment),
                  skills : JSON.stringify(tagArr)
                })
            })
            .then((response) => response.json())
            .then((res) => {
              
              this.setState({
                isLoading: false,
                clearTagList: true
              });

              if(res.status == 200) {
              
                alert(res.data);
              } else {

                if(res.errortype == 'validation') {
                  console.log(res.data);
                }
                else if(res.errortype == 'db-error') {
                  
                  alert('Sorry Some Error Occured');
                }    
              }       
            })
            .catch((error) => {

              this.setState({
                isLoading: false
              });
              console.log(error);
              alert("Some Error Occured. Try Again");
            })
          ).catch((error) => {

              this.setState({
                isLoading: false
              });

              alert("Server not responding. Try again");
          });

        } else {
          ToastAndroid.show('No Internet Connection!', ToastAndroid.SHORT);
        }
      });

      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this.handleFirstConnectivityChange
      );
    }
  }
  deleteTask = () =>{
    Alert.alert(      
      'Delete Task ?',   
      '',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Button Pressed'), style: 'cancel'}, 
        {text: 'OK', onPress: () => console.log('OK ButtonPressed')},      
      ]
   
    )
   
  }
   

  render() {
    if(this.state.showLoadingScreen == true)
      return (
        <LoadingComponent />
      );
    else
      return (
       <Container style={{backgroundColor: '#fff'}}>
     
          <Header  style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
            <Left>
              <Button transparent onPress={() => Actions.generatedtasks()}>
                <Icon name="arrow-back" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: "#FFF" }}>Edit Task</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.deleteTask}>
                <Icon name="trash" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
              </Button>
            </Right>
          </Header>

          <Content>
            <Form>
              <Item stackedLabel>
                <Label >Title</Label>
                <InputText
                    isError={this.state.titleError.isError}
                    keyboardType="email-address"
                    value={this.state.title}
                    onChangeText={title => this.setState({title})}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    onSubmitEditing={() => {this.description.focus()}}
                    onBlur={() => {
                        titleError = validate("title",this.state.title,{required:true})
                        this.setState({
                          titleError: Object.assign(this.state.titleError, titleError)
                        })
                      }}
                    />
                <TextInputError isError={this.state.titleError.isError} message={this.state.titleError.message} />
              </Item>
              <Item stackedLabel >
                <Label>Description</Label>
                <InputText
                    multiline={true}
                    numberOfLines={3}
                    isError={this.state.descriptionError.isError} 
                    value={this.state.description}
                    onChangeText={description => this.setState({description})}
                    inputRef={(input) => this.description = input}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    onBlur={() => {
                        descriptionError = validate("description",this.state.description,{required:true})
                        this.setState({
                          descriptionError: Object.assign(this.state.descriptionError, descriptionError)
                        })
                      }}
                    />
                <TextInputError isError={this.state.descriptionError.isError} message={this.state.descriptionError.message} /> 
              </Item>

              <Item stackedLabel >
                <Label>Payment</Label>
                <InputText
                    isError={this.state.paymentError.isError}
                    keyboardType={'numeric'}
                    value={`${this.state.payment}`}
                    onChangeText={payment => this.setState({payment})}
                    inputRef={(input) => this.payment = input}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    onSubmitEditing={() => {this.tag.focus()}}
                    onBlur={() => {
                        paymentError = validate("payment",Number(this.state.payment) ,{required:true, integer: true})
                        this.setState({
                          paymentError: Object.assign(this.state.paymentError, paymentError)
                        })
                      }}
                    />
                <TextInputError isError={this.state.paymentError.isError} message={this.state.paymentError.message} /> 
              </Item>

              <Item stackedLabel last>
                <Label>Skills</Label>
                <InputTag
                    isError={this.state.tagError.isError}
                    initialTags={this.state.tags}
                    onChangeTags={tags => this.setState({tags})}
                    inputRef={(input) => this.tag = input}
                    returnKeyType={'done'}
                    showTagCloseButton={true}
                    clearTags={this.state.clearTags}
                    />
                <TextInputError isError={this.state.tagError.isError} message={this.state.tagError.message} /> 
              </Item>
            </Form>
            <Button block style={{ margin: 15, marginTop: 50,backgroundColor: '#369' }} onPress={this.updateTask}>
                <Label style={{color: '#fff'}} >Update Task</Label>
            </Button>
            { this.state.isLoading == true ? <Spinner color='#d7d4f0' /> : null}
          </Content>
  
        </Container>
      );
  }
}

const styles = StyleSheet.create({

});