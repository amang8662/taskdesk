import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AsyncStorage,
  NetInfo,
  ScrollView,
  ToastAndroid
} from 'react-native';

import { InputText, TextInputError, InputTag } from '../../components';
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { Spinner } from 'native-base';
import { ipaddress } from '../../Globals';
import styles from '../style';



export default class AddTask extends Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      titleError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      description: '',
      descriptionError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      tags: [],
      tagError: {
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

    //Check tag
    const tagError = validate("tag",this.state.tags,{required:true,type: 'array'});
    
    this.setState({
      tagError: Object.assign(this.state.tagError, tagError)
    })

    if(this.state.titleError.isError || this.state.descriptionError.isError|| this.state.tagError.isError) {
      return false;
    } else {
      return true;
    }
  }

  addTask = () => {
    const {title, description, tags} = this.state;

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
            fetch('http://' + ipaddress() + ':3000/task/add' , {
                method : 'post',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
                },
                'body' : JSON.stringify({
                  title : title.toLowerCase(),
                  description : description,
                  skills : JSON.stringify(tagArr),
                  user : {
                            _id : userdata._id,
                            level : userdata.level
                         }
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
                  console.log(res.message);
                  alert("Please enter valid details");
                } 
                // else if(res.errortype == 'unique-error') {

                //     alert("Data must be unique");
                //   }
                // }
                else if(res.errortype == 'db-error') {
                  
                  alert('Sorry Some Error Occured');
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

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.text}>Title</Text>
          <InputText
              isError={this.state.titleError.isError}
              placeholder="Title"
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
          <Text style={styles.text}>Description</Text>
          <InputText
              multiline={true}
              numberOfLines={20}
              isError={this.state.descriptionError.isError} 
              placeholder="Description"
              value={this.state.description}
              onChangeText={description => this.setState({description})}
              ref={(input) => this.description = input}
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
          <Text style={styles.text}>Tags</Text>
          <InputTag
              isError={this.state.tagError.isError}
              initialTags={this.state.tags}
              onChangeTags={tags => this.setState({tags})}
              ref={(input) => this.tag = input}
              returnKeyType={'done'}
              showTagCloseButton={true}
              />
          <TextInputError isError={this.state.tagError.isError} message={this.state.tagError.message} /> 
          <TouchableHighlight style={styles.button} onPress={this.addTask}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
          { this.state.isLoading == true ? <Spinner color='#d7d4f0' /> : null}
        </View>
      </ScrollView>
    );
  }
}

