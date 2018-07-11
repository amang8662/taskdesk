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

import { InputText, TextInputError, Toast } from '../../components';
import { validate, timeout } from '../../modules';
import { Spinner } from 'native-base';
import { baseurl } from '../../Globals';


export default class AddSkill extends Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      
      name: '',
      nameError: {
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
    const nameError = validate("name",this.state.name,{required:true});
   
    this.setState({
      nameError: Object.assign(this.state.nameError, nameError)
    })

    if(this.state.nameError.isError) {
      return false;
    } else {
      return true;
    }
  }

  addSkill = () => {
    const { name } = this.state;

    const isFormValid = this.validateForm();
    
    if(isFormValid) {
      
      NetInfo.isConnected.fetch().then((isConnected) => {

        this.setState({
          isLoading: true
        });

        if(isConnected) {

          timeout(10000, 
            fetch(baseurl + '/skill/add' , {
                method : 'post',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
                },
                'body' : JSON.stringify({
                  name : name.toLowerCase()
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

                  alert("Name must be unique");
                }
                else {
                  
                  alert('Sorry Some Error Occured');
                }
              } else {
                alert('Sorry Some Error Occured');
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

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.text}>Skill Name</Text>
          <InputText
              isError={this.state.nameError.isError}
              placeholder="name"
              value={this.state.name}
              onChangeText={name => this.setState({name})}
              returnKeyType={'done'}
              onBlur={() => {
                  nameError = validate("name",this.state.name,{required:true})
                  this.setState({
                    nameError: Object.assign(this.state.nameError, nameError)
                  })
                }}
              />
          <TextInputError styles={errorStyle} isError={this.state.nameError.isError} message={this.state.nameError.message} />
          <TouchableHighlight style={styles.button} onPress={this.addSkill}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
          { this.state.isLoading == true ? <Spinner color='#d7d4f0' /> : null}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#000',
    flexGrow: 1,
    paddingTop: 30,
    paddingBottom: 30
  },
  formContainer : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    color: '#00ffff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start' 
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
  }
});

const errorStyle = StyleSheet.create({
  container : {
    justifyContent:'flex-start',
    alignItems: 'flex-start',    
    paddingHorizontal:16,
  },
  errorText : {
    color: '#000',
    fontSize: 14
  }
});