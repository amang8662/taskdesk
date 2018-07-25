import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  NetInfo,
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

import { Logo, InputText, TextInputError, Toast } from '../../components';
import { validate, timeout } from '../../modules';

import { Spinner } from 'native-base';
import { baseurl } from '../../Globals';

import { Actions } from 'react-native-router-flux';

export default class Signup extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      userName: '',
      userNameError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      contact: '',
      contactError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      password: '',
      passwordError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      isLoading: false
    };
    this.validateForm = this.validateForm.bind(this);
  }

  validateForm() {

    //Check name
    const nameError = validate("name",this.state.name,{required:true,min:3,max:40});
    
    this.setState({
      nameError: Object.assign(this.state.nameError, nameError)
    })

    //Check username
    const userNameError = validate("username",this.state.userName,{required:true,min:4,max:25});
   
    this.setState({
      userNameError: Object.assign(this.state.userNameError, userNameError)
    })

    //Check Contact
    const contactError = validate("contact",this.state.contact,{required:true,regex:true});

    this.setState({
      contactError: Object.assign(this.state.contactError, contactError)
    });

    //Check Password
    const passwordError = validate("password",this.state.password,{required:true,min:8,max:30});
    
    this.setState({
      passwordError: Object.assign(this.state.passwordError, passwordError)
    })

    if(this.state.nameError.isError || this.state.userNameError.isError || this.state.contactError.isError || this.state.passwordError.isError) {
      return false;
    } else {
      return true;
    }
  }

  register = () => {
    const {name, userName, contact, password} = this.state;
    const isFormValid = this.validateForm();
    
    if(isFormValid) {

      NetInfo.isConnected.fetch().then((isConnected) => {

        this.setState({
          isLoading: true
        });

        if(isConnected) {

          timeout(10000, 
            fetch(baseurl + '/register' , {
                method : 'post',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
                },
                'body' : JSON.stringify({
                  name : name,
                  username : userName.toLowerCase(),
                  contact : contact,
                  password : password
                })
            })
            .then((response) => response.json())
            .then((res) => {
              
              this.setState({
                isLoading: false
              });

              if(res.status == 200) {
                alert(res.message);
              } else if(res.status == 400) {

                alert("Please enter valid details");
              } else if(res.status == 500) {

                if(res.errortype == 'unique-error') {

                  if(res.data.fields.username && res.data.fields.contact) {
                    alert("Username and Contact are already taken.");
                  } else if(res.data.fields.username){
                    alert("Username is already taken.");
                  } else {
                    alert("Contact is already taken.");
                  }
                } else {
                  alert(res.message);
                }
              }  else {
                alert(res.message);
              }    
            })
            .catch((error) => {
                console.log(error);
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
            duration: 10000
          });
        }
      });
    }
  }

  goBack() {
      Actions.pop();
  }

  render() {

    var nameError = {};
    var userNameError = {};
    var contactError = {};
    var passwordError = {};
    return(
      <Container style={styles.container}>
        <Content>
        <Logo/>
        <Form style={{marginLeft:-10,marginRight: 2,}}>
          <Item stackedLabel>
          <Label >Fullname</Label>
          <InputText
              isError={this.state.nameError.isError} 
              placeholder="Full Name"
              value={this.state.name}
              onChangeText={name => this.setState({name})}
              returnKeyType={'next'}
              blurOnSubmit={false}
              onSubmitEditing={() => {this.username.focus()}}
              onBlur={() => {
                  nameError = validate("name",this.state.name,{required:true,min:3,max:40});
                  this.setState({
                    nameError: Object.assign(this.state.nameError, nameError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.nameError.isError} message={this.state.nameError.message} />
        </Item>
        <Item stackedLabel >
            <Label >Username</Label>

          <InputText
              isError={this.state.userNameError.isError} 
              placeholder="Username"
              value={this.state.userName}
              onChangeText={userName => this.setState({userName})}
              inputRef={(input) => this.username = input}
              returnKeyType={'next'}
              blurOnSubmit={false}
              onSubmitEditing={() => {this.contact.focus()}}
              onBlur={() => {
                  userNameError = validate("username",this.state.userName,{required:true,regex:true,regexExp:'^[a-zA-Z0-9\-]+$',regexMsg:'Username must contain only letters, numbers or -',min:4,max:25})
                  this.setState({
                    userNameError: Object.assign(this.state.userNameError, userNameError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.userNameError.isError} message={this.state.userNameError.message} />
        </Item>
        <Item stackedLabel >
            <Label >Contact</Label>

          <InputText
              isError={this.state.contactError.isError} 
              placeholder="contact"
              keyboardType={'numeric'}
              maxLength={10}
              value={this.state.contact}
              onChangeText={contact => this.setState({contact})}
              inputRef={(input) => this.contact = input}
              returnKeyType={'next'}
              blurOnSubmit={false}
              onSubmitEditing={() => {this.password.focus()}}
              onBlur={() => {
                  contactError = validate("contact",Number(this.state.contact),{required:true,regex:true})
                  this.setState({
                    contactError: Object.assign(this.state.contactError, contactError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.contactError.isError} message={this.state.contactError.message} />
        </Item>
        <Item stackedLabel >
            <Label >Password</Label>
          <InputText
              isError={this.state.passwordError.isError} 
              placeholder="Password"
              secureTextEntry={true}
              inputRef={(input) => this.password = input}
              value={this.state.password}
              onChangeText={password => this.setState({password})}
              inputRef={(input) => this.password = input}
              returnKeyType={'done'}
              onBlur={() => {
                  passwordError = validate("password",this.state.password,{required:true,min:8,max:30})
                  this.setState({
                    passwordError: Object.assign(this.state.passwordError, passwordError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.passwordError.isError} message={this.state.passwordError.message} />  
        </Item>
        </Form>
        <View style={styles.signupTextCont}>
          <Button block style={styles.button} onPress={this.register}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Button>
          { this.state.isLoading == true ? <Spinner color='#d7d4f0' /> : null}    
    
          <Text style={styles.signupText}>Already have an account?
            <Text onPress={this.goBack}><Text style={styles.signupButton}> Sign in!</Text></Text>
          </Text>
        </View>
        </Content>
      </Container>
      )
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#fafafa',
    flexGrow: 1,
    paddingTop: 30
  },
  signupTextCont : {
    alignSelf: 'stretch',
    margin: 15,
  },
  signupText: {
    color:'#666',
    fontSize:16,
    textAlign: 'center'
  },
  signupButton: {
    color:'#369',
    fontSize:20,
    fontWeight:'500'
  },
  formContainer : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },

  
  button: {
    width:null,
    alignItems: 'stretch',
    backgroundColor:'#00b386',
    borderRadius: 0,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize:20,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  },
});

const errorStyle = StyleSheet.create({
  container : { 
    padding:16,
    alignSelf:  'flex-end'
  },
  errorText : {
    color: '#dc4239',
    fontSize: 12
  }
});
