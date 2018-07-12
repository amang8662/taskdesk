import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image,
  NetInfo,
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
  Form, Item, Label, Spinner
} from 'native-base';
import { InputText, TextInputError, InputTag } from '../../components';
import { validate, timeout } from '../../modules';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
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

    let user = User.get();
    this.state = {
      avatar: {},
      name: user.name,
      nameError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      username: user.username,
      usernameError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      contact: user.contact,
      contactError: {
        'isError': false,
        'errortype': '',
        'message':  ''
      },
      title: user.title,
      about: user.about,
      skills: user.skills,
      clearTagList: false,
      isLoading: false
    }
    this.validateForm = this.validateForm.bind(this);
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

                  this.setState(prevState => ({
                      avatar: [...prevState.avatar, {data: ''}]
                    })
                  )

                } catch(error) {

                  alert("Some error Occured. Try Again");
                }
                
              } else {

                if(res.errortype == 'validation') {
                  console.log(res.data);
                }
                else {
                  
                  alert(res.message);
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
          Toast.show({text: 'No Internet Connection!',
            textColor: '#cccccc',
            duration: 5000});
        }
      });
    } else {
      alert("No Avatar Selected")
    }
  }

  validateForm() {

    //Check name
    const nameError = validate("name",this.state.name,{required:true,min:3,max:40});
    
    this.setState({
      nameError: Object.assign(this.state.nameError, nameError)
    })

    //Check username
    const usernameError = validate("username",this.state.username,{required:true,min:4,max:25});
   
    this.setState({
      usernameError: Object.assign(this.state.usernameError, usernameError)
    })

    //Check Contact
    const contactError = validate("contact",this.state.contact,{required:true,regex:true});

    this.setState({
      contactError: Object.assign(this.state.contactError, contactError)
    });

    if(this.state.nameError.isError || this.state.usernameError.isError || this.state.contactError.isError) {
      return false;
    } else {
      return true;
    }
  }

  updateUser = () => {
    const {name, username, contact, title, about, skills} = this.state;
    const isFormValid = this.validateForm();
    
    if(isFormValid) {

      NetInfo.isConnected.fetch().then((isConnected) => {

        this.setState({
          isLoading: true
        });

        if(isConnected) {

          let formdata = {
            name: name,
            username: username,
            contact: contact,
            title: title,
            about: about,
            skills: JSON.stringify(skills)
          }

          timeout(10000, 
            fetch(baseurl + '/user/' + User.get()._id, {
                method : 'put',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
                },
                'body' : JSON.stringify(formdata)
            })
            .then((response) => response.json())
            .then((res) => {
              
              this.setState({
                isLoading: false,
                clearTagList: false
              });

              if(res.status == 200) {

                try {

                  AsyncStorage.setItem('user' , res.data);
                  User.set(res.data);
                  alert(res.message);

                } catch(error) {

                  alert("Some error Occured. Try Again");
                }
              } else if(res.status == 400) {

                alert("Please enter valid details");
              } else if(res.status == 500) {
                
                if(res.errortype == 'unique-error') {

                  if(res.data.fields.username && res.data.fields.contact) {
                    alert("Username and contact are already taken.");
                  } else if(res.data.fields.username){
                    alert("Username is already taken.");
                  } else {
                    alert("contact is already taken.");
                  }
                } else { 
                  alert(res.message);
                }
              } else {
                alert(res.message)
              }     
            })
            .catch((error) => {

                this.setState({
                  isLoading: false
                });

                console.log(error);
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
            duration: 5000});
        }
      });
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
            <Button danger onPress={this.updateUser}>
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
                <Button warning  style={styles.btn} onPress={this.selectAvatar.bind(this)}>
                  <View> 
                    <Text style={{color: '#ffffff',fontSize: 14}}>Select Avatar</Text>
                  </View>
                </Button>
              </Left>
              <Right>
                <Button success style={styles.btn} onPress={this.uploadAvatar}>
                 <View> 
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
                  <InputText
                      isError={this.state.nameError.isError}
                      value={this.state.name}
                      onChangeText={name => this.setState({name})}
                      inputRef={(input) => this.name = input}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {this.username.focus()}}
                      onBlur={() => {
                          nameError = validate("name",this.state.name,{required:true})
                          this.setState({
                            nameError: Object.assign(this.state.nameError, nameError)
                          })
                        }}
                      />
                  <TextInputError isError={this.state.nameError.isError} message={this.state.nameError.message} />
                </Item>
                <Item stackedLabel>
                  <Label >Username</Label>
                  <InputText
                      isError={this.state.usernameError.isError}
                      value={this.state.username}
                      onChangeText={username => this.setState({username})}
                      inputRef={(input) => this.username = input}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {this.contact.focus()}}
                      onBlur={() => {
                          usernameError = validate("username",this.state.username,{required:true})
                          this.setState({
                            usernameError: Object.assign(this.state.usernameError, usernameError)
                          })
                        }}
                      />
                  <TextInputError isError={this.state.usernameError.isError} message={this.state.usernameError.message} />
                </Item>
                <Item stackedLabel>
                  <Label >contact</Label>
                  <InputText
                      isError={this.state.contactError.isError}
                      keyboardType={'numeric'}
                      value={this.state.contact}
                      onChangeText={contact => this.setState({contact})}
                      inputRef={(input) => this.contact = input}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {this.title.focus()}}
                      onBlur={() => {
                          contactError = validate("contact",this.state.contact,{required:true,regex:true})
                          this.setState({
                            contactError: Object.assign(this.state.contactError, contactError)
                          })
                        }}
                      />
                  <TextInputError isError={this.state.contactError.isError} message={this.state.contactError.message} />
                </Item>
                <Item stackedLabel>
                  <Label >Title</Label>
                  <InputText
                      value={this.state.title}
                      onChangeText={title => this.setState({title})}
                      inputRef={(input) => this.title = input}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {this.about.focus()}}
                      />
                </Item>
                <Item stackedLabel>
                  <Label >About</Label>
                  <InputText
                      value={this.state.about}
                      onChangeText={about => this.setState({about})}
                      inputRef={(input) => this.about = input}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      multiline={true}
                      numberOfLines={10}
                      />
                </Item>
                <Item stackedLabel last>
                  <Label>Skills</Label>
                  <InputTag
                      initialTags={this.state.skills}
                      onChangeTags={skills => this.setState({skills})}
                      inputRef={(input) => this.skill = input}
                      returnKeyType={'done'}
                      showTagCloseButton={true}
                      clearTagList={this.state.clearTagList}
                      />
                </Item>
              </Form>
              { this.state.isLoading == true ? <Spinner color='#dc4239' /> : null}
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