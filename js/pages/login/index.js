import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AsyncStorage,
  NetInfo,
  ScrollView,
} from 'react-native';


import { Logo, InputText, TextInputError, Toast } from '../../components';
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { Spinner } from 'native-base';
import { baseurl } from '../../Globals';

import { Actions } from 'react-native-router-flux';

export default class Login extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userNameError: {
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

    //Check username
    const userNameError = validate("username/Email",this.state.userName,{required:true});
   
    this.setState({
      userNameError: Object.assign(this.state.userNameError, userNameError)
    })

    //Check Password
    const passwordError = validate("password",this.state.password,{required:true});
    
    this.setState({
      passwordError: Object.assign(this.state.passwordError, passwordError)
    })

    if(this.state.userNameError.isError || this.state.passwordError.isError) {
      return false;
    } else {
      return true;
    }
  }

  login = () => {
    const {userName, password} = this.state;
    const isFormValid = this.validateForm();
    
    if(isFormValid) {
      
      NetInfo.isConnected.fetch().then((isConnected) => {

        this.setState({
          isLoading: true
        });

        if(isConnected) {

          timeout(10000, 
            fetch(baseurl + '/login' , {
                method : 'post',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
                },
                'body' : JSON.stringify({
                  username : userName.toLowerCase(),
                  password : password
                })
            })
            .then((response) => response.json())
            .then((res) => {
              
              this.setState({
                isLoading: false
              });

              if(res.status == 200) {
                
                try {

                  AsyncStorage.setItem('user' , res.data);
                  User.set(res.data);
                  Actions.reset('authenticated');
                } catch(error) {

                  alert("Some error Occured. Try Again");
                } 
              } else {

                if(res.status == 404) {
                  alert(res.message);
                } else if(res.status == 401) {
                  alert(res.message);
                } else { 
                  alert('Some error Occured. Try Again');
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

  signup() {
    Actions.signup()
  }

  render() {
    return(
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Logo/>
          <InputText
              isError={this.state.userNameError.isError}
              placeholder="Username/Contact"
              keyboardType="email-address"
              value={this.state.userName}
              onChangeText={userName => this.setState({userName})}
              returnKeyType={'next'}
              blurOnSubmit={false}
              onSubmitEditing={() => {this.password.focus()}}
              onBlur={() => {
                  userNameError = validate("username/Contact",this.state.userName,{required:true})
                  this.setState({
                    userNameError: Object.assign(this.state.userNameError, userNameError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.userNameError.isError} message={this.state.userNameError.message} />
          <InputText
              isError={this.state.passwordError.isError} 
              placeholder="Password"
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={password => this.setState({password})}
              inputRef={(input) => this.password = input}
              returnKeyType={'done'}
              onBlur={() => {
                  passwordError = validate("password",this.state.password,{required:true})
                  this.setState({
                    passwordError: Object.assign(this.state.passwordError, passwordError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.passwordError.isError} message={this.state.passwordError.message} /> 
          <TouchableHighlight style={styles.button} onPress={this.login}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableHighlight>
          { this.state.isLoading == true ? <Spinner color='#d7d4f0' /> : null}
        </View>
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Don't have an account yet?</Text>
          <TouchableHighlight onPress={this.signup}><Text style={styles.signupButton}> Signup</Text></TouchableHighlight>
        </View>
      </ScrollView>
      )
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#000',
    flexGrow: 1,
    paddingTop: 30
  },
  signupTextCont : {
    flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
    flexDirection:'row'
  },
  signupText: {
    color:'rgba(255,255,255,0.6)',
    fontSize:16
  },
  signupButton: {
    color:'#ffffff',
    fontSize:16,
    fontWeight:'500'
  },
  formContainer : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },

  inputBox: {
    width:300,
    borderBottomColor: '#eee',
    borderWidth: 2,
    paddingHorizontal:16,
    fontSize:16,
    backgroundColor: '#222',
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:300,
    backgroundColor:'#369',
    borderRadius: 0,
    marginVertical: 10,
    paddingVertical: 15
  },
  buttonText: {
    fontSize:18,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  },
  inputBoxError: {
    width:300,
    borderWidth: 3,
    paddingHorizontal:16,
    color: '#ffffff',
    fontSize:16,
    marginVertical: 10,
    borderStyle: 'solid',
    backgroundColor: '#222',
    borderBottomColor : '#d83c3c'
  }
});

const errorStyle = StyleSheet.create({
  container : {
    justifyContent:'flex-start',
    alignItems: 'flex-start',    
    paddingHorizontal:16,
  },
  errorText : {
    color: '#bbb',
    fontSize: 14
  }
});