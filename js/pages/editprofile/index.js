import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image,
  NetInfo,
  ToastAndroid,
  AsyncStorage
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
  Card,
  CardItem,
  Form, Item, Input,Label,
} from 'native-base';
import { InputText, TextInputError, InputTag } from '../../components';
import { Actions } from 'react-native-router-flux';
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
      avatar: {}
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
    return (
      <Container style={styles.container}>
        <Header  style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
          <Left>
            <Button transparent onPress={() => Actions.profilehome()}>
              <Icon name="arrow-back" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#FFF" }}>Edit Profile</Title>
          </Body>
          <Right>            
            <Button danger onPress={() => Actions.editprofile()}>
              <Icon name="md-checkbox-outline" style={{ color: "#FFF",fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Right>
        </Header>
        <Content padder >
          <Card style={{ elevation: 3}}>
            <CardItem >
              <Body style={{alignItems: 'center',}}>
                <View style={styles.profilePicWrap} >
                    <Image style={styles.profilePic} source={{ uri: this.state.avatar.uri ? this.state.avatar.uri :
                        baseurl + "/uploads/avatar/" + User.get().avatar }}/>
                </View>
              </Body>
            </CardItem>
            
            <CardItem>
              <Left>
                <Button warning  style={styles.btn}>
                  <View  onPress={this.selectAvatar.bind(this)}> 
                    <Text style={{color: '#ffffff',fontSize: 14}}>Select Avatar</Text>
                  </View>
                </Button>
              </Left>
              <Right>
                <Button success style={styles.btn}>
                 <View  onPress={this.uploadAvatar}> 
                   <Text style={{color: '#ffffff',fontSize: 14}}>Upload Avatar</Text>
                 </View>
                </Button>
              </Right>
             </CardItem>
            
          </Card>
        
          <Card>
              <Form>
                <Item stackedLabel>
                  <Label >Name</Label>
                  <Input />
                </Item>
                <Item stackedLabel>
                  <Label >Username</Label>
                  <Input />
                </Item>
                <Item stackedLabel>
                  <Label >Title</Label>
                  <Input />
                </Item>
                <Item stackedLabel>
                  <Label >About</Label>
                  <Input />
                </Item>
                <Item stackedLabel>
                  <Label >Email-Id</Label>
                  <Input />
                </Item>
                <Item stackedLabel>
                  <Label >Enter Current password</Label>
                  <Input />
                </Item>
                <Item stackedLabel>
                  <Label >Enter Current password</Label>
                  <Input />
                </Item>
                <Item stackedLabel>
                  <Label >Enter New password</Label>
                  <Input />
                </Item>
              </Form>
          </Card>
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
  btn:{
    margin: 5,
    elevation: 10,
    minWidth: '33%',
    borderRadius: 0,
    padding: 14,

  }
});