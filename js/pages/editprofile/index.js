import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  NetInfo,
  ToastAndroid,
  AsyncStorage
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import { timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';

var imagePickerOptions = {
  title: 'Select Avatar',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from Gallery',
  quality: 1
};

export default class EditProfile extends Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      avatar: {},
      user: User.get()
    }
  }

  selectAvatar() {
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        
        this.setState({
          avatar: Object.assign(this.state.avatar, response)
        });
      }
    });
  }

  uploadAvatar = () => {
    const {avatar} = this.state;
    
    if(avatar.data) {
      
      NetInfo.isConnected.fetch().then((isConnected) => {

        if(isConnected) {

          const formdata = new FormData();

          let data = {
            uri: avatar.uri,
            name: avatar.fileName,
            type: avatar.type,
            data: "base64:" + avatar.data
          }

          formdata.append('avatar', data);

          timeout(10000, 
            fetch(baseurl + '/user/update/avatar/' + User.get()._id , {
                method : 'post',
                headers : {
                  'Content-type' : 'multipart/form-data'
                },
                body: formdata
            })
            .then((response) => response.json())
            .then((res) => {
            

              if(res.status == 200) {
                
                try {

                  AsyncStorage.setItem('user' , res.data);
                  User.set(res.data);
                  alert("Avatar Image Changed");
                } catch(error) {

                  alert("Some error Occured. Try Again");
                }
                
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
              console.log(error);
              alert("Some Error Occured. Try Again");
            })
          ).catch((error) => {
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
    console.log(this.state.avatar);
    return (
      <View style={styles.container}>
        <Image style={styles.image} 
          source={{ uri: this.state.avatar.uri ? this.state.avatar.uri :
            baseurl + "/uploads/avatar/" + this.state.user.avatar
          }}
        />
        <TouchableOpacity style={styles.button} onPress={this.selectAvatar.bind(this)}> 
          <Text>Select Avatar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.uploadAvatar}> 
          <Text>Upload Avatar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#455a64',
    flex: 1,
    paddingTop: 30,
    justifyContent:'center',
    alignItems: 'center'
  },
  button: {
    width:200,
    backgroundColor:'#ff0000',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  image: {
    width: 200,
    height: 200,
    backgroundColor: '#fff'
  }
});