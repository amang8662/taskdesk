import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  NetInfo,
  ScrollView,
  ToastAndroid
} from 'react-native';

import queryString from 'query-string';
import { Spinner } from 'native-base';
import validate from '../../modules/validate';
import { ipaddress } from '../../Globals';

import Logo from '../../components/logo';
import TextInputError from '../../components/textinputerror';

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
      email: '',
      emailError: {
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
      // alert('Connection Established');
    } else {
      ToastAndroid.show('No Internet Connection!', ToastAndroid.SHORT);
      // alert('No Internet Connection!');
    }

    // NetInfo.isConnected.removeEventListener(
    //   'connectionChange',
    //   this.handleFirstConnectivityChange
    // );
  }

  validateForm() 
{
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

    //Check Email
    const emailError = validate("email",this.state.email,{required:true,regex:true});

    this.setState({
      emailError: Object.assign(this.state.emailError, emailError)
    });

    //Check Password
    const passwordError = validate("password",this.state.password,{required:true,min:8,max:30});
    
    this.setState({
      passwordError: Object.assign(this.state.passwordError, passwordError)
    })

    if(this.state.nameError.isError || this.state.userNameError.isError || this.state.emailError.isError || this.state.passwordError.isError) {
      return false;
    } else {
      return true;
    }
  }

  register = () => {
    const {name, userName, email, password} = this.state;
    const isFormValid = this.validateForm();
    
    if(isFormValid) {

      this.setState({
        isLoading: true
      });

      NetInfo.isConnected.fetch().then((isConnected) => {

          if(isConnected) {

            fetch('http://' + ipaddress() + ':3000/register' , {
                method : 'post',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/x-www-form-urlencoded'
                },
                'body' : queryString.stringify({
                  name : name,
                  username : userName,
                  email : email,
                  password : password
                })
            })
            .then((response) => response.json())
            .then((res) => {
              
              this.setState({
                isLoading: false
              });

              if(res.status == true) {
                alert(res.message);
              } else if(res.status == false) {
                if(res.errortype == 'validation') {
                  alert("Please enter valid details");
                } else if(res.errortype == 'unique-error') {

                  if(res.fields.username && res.fields.email) {
                    alert("Username and Email are already taken.");
                  } else if(res.fields.username){
                    alert("Username is already taken.");
                  } else {
                    alert("Email is already taken.");
                  }
                } else if(res.errortype == 'db-error') {
                  
                  alert('Sorry Some Error Occured');
                }
              }       
            })
            .catch((error) => {
                alert(error);
            });

          } else {
            ToastAndroid.show('No Internet Connection!', ToastAndroid.SHORT);
            // alert('No Internet Connection!');
          }
      });

      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this.handleFirstConnectivityChange
      );

      // this.setState({
      //   isLoading: false
      // });
    }
  }

  goBack() {
      Actions.pop();
  }

  render() {

    var nameError = {};
    var userNameError = {};
    var emailError = {};
    var passwordError = {};
    return(
      <ScrollView contentContainerStyle={styles.container}>
        <Logo/>
        <View style={styles.formContainer}>
          <TextInput style={this.state.nameError.isError ? styles.inputBoxError : styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Full Name"
              placeholderTextColor = {this.state.nameError.isError ? styles.placeholderErrorTextColor : '#ffffff'}
              selectionColor="#fff"
              value={this.state.name}
              onChangeText={name => this.setState({name})}
              onBlur={() => {
                  nameError = validate("name",this.state.name,{required:true,min:3,max:40});
                  this.setState({
                    nameError: Object.assign(this.state.nameError, nameError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.nameError.isError} message={this.state.nameError.message} />
          <TextInput style={this.state.userNameError.isError ? styles.inputBoxError : styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Username"
              placeholderTextColor = {this.state.userNameError.isError ? styles.placeholderErrorTextColor : '#ffffff'}
              selectionColor="#fff"
              value={this.state.userName}
              onChangeText={userName => this.setState({userName})}
              onBlur={() => {
                  userNameError = validate("username",this.state.userName,{required:true,regex:true,regexExp:'^[a-zA-Z0-9\-]+$',regexMsg:'Username must contain only letters, numbers or -',min:4,max:25})
                  this.setState({
                    userNameError: Object.assign(this.state.userNameError, userNameError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.userNameError.isError} message={this.state.userNameError.message} />
          <TextInput style={this.state.emailError.isError ? styles.inputBoxError : styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Email"
              placeholderTextColor = {this.state.emailError.isError ? styles.placeholderErrorTextColor : '#ffffff'}
              selectionColor="#fff"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={email => this.setState({email})}
              onBlur={() => {
                  emailError = validate("email",this.state.email,{required:true,regex:true})
                  this.setState({
                    emailError: Object.assign(this.state.emailError, emailError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.emailError.isError} message={this.state.emailError.message} />
          <TextInput style={this.state.passwordError.isError ? styles.inputBoxError : styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor = {this.state.passwordError.isError ? styles.placeholderErrorTextColor : '#ffffff'}
              ref={(input) => this.password = input}
              value={this.state.password}
              onChangeText={password => this.setState({password})}
              onBlur={() => {
                  passwordError = validate("password",this.state.password,{required:true,min:8,max:30})
                  this.setState({
                    passwordError: Object.assign(this.state.passwordError, passwordError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.passwordError.isError} message={this.state.passwordError.message} />  
           <TouchableOpacity style={styles.button} onPress={this.register}>
             <Text style={styles.buttonText}>Sign Up</Text>
           </TouchableOpacity>
           { this.state.isLoading == true ? <Spinner color='#d7d4f0' /> : null}    
        </View>
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Already have an account?</Text>
          <TouchableOpacity onPress={this.goBack}><Text style={styles.signupButton}> Sign in</Text></TouchableOpacity>
        </View>
      </ScrollView> 
      )
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#455a64',
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
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:300,
    backgroundColor:'#1c313a',
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  },
  inputBoxError: {
    width:300,
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    marginVertical: 10,
    borderStyle: 'solid',
    color: '#a94442',
    backgroundColor: '#fee',
    borderWidth: 1,
    borderColor: '#d83c3c'
  },
  placeholderErrorTextColor: {
    color: '#a94442'
  }
});

const errorStyle = StyleSheet.create({
  container : {
    justifyContent:'flex-start',
    alignItems: 'flex-start',    
    paddingHorizontal:16,
  },
  errorText : {
    color: '#d83c3c'
  }
});
