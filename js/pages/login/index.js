import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  AsyncStorage,
  NetInfo,
  ScrollView,
  ToastAndroid
} from 'react-native';

import queryString from 'query-string';
import { Spinner } from 'native-base';
import validate from '../../modules/validate';
import timeout from '../../modules/timeout';
import { ipaddress } from '../../Globals';

import Logo from '../../components/logo';
import TextInputError from '../../components/textinputerror';

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
            fetch('http://' + ipaddress() + ':3000/login' , {
                method : 'post',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/x-www-form-urlencoded'
                },
                'body' : queryString.stringify({
                  username : userName.toLowerCase(),
                  password : password
                })
            })
            .then((response) => response.json())
            .then((res) => {
              
              this.setState({
                isLoading: false
              });

              if(res.status == true) {
                
                try {

                  AsyncStorage.setItem('userid' , res.data);
                  Actions.reset('authenticated',{userid: res.data});
                } catch(error) {

                  alert("Some error Occured. Try Again");
                } 
              } else if(res.status == false) {

                if(res.errortype == 'no-user-error') {
                  alert("Username/Email is not registered");
                } else if(res.errortype == 'password-error') {
                  alert("Invalid Credentials");
                } else { 
                  alert('Some error Occured. Try Again');
                }
              }       
            })
            .catch((error) => {
                alert(error);
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

  signup() {
    Actions.signup()
  }

  render() {
    return(
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Logo/>
          <TextInput style={this.state.userNameError.isError ? styles.inputBoxError : styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Username/Email"
              placeholderTextColor = '#aeaeae'
              selectionColor="#fff"
              keyboardType="email-address"
              value={this.state.userName}
              onChangeText={userName => this.setState({userName})}
              returnKeyType={'next'}
              blurOnSubmit={false}
              onSubmitEditing={() => {this.password.focus()}}
              onBlur={() => {
                  userNameError = validate("username/Email",this.state.userName,{required:true})
                  this.setState({
                    userNameError: Object.assign(this.state.userNameError, userNameError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.userNameError.isError} message={this.state.userNameError.message} />
          <TextInput style={this.state.passwordError.isError ? styles.inputBoxError : styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor = '#aeaeae'
              value={this.state.password}
              onChangeText={password => this.setState({password})}
              ref={(input) => this.password = input}
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