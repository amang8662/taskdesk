import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  NetInfo,
  ScrollView,
  ToastAndroid
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { LoadingComponent } from '../../components';
import Tag from "../../components/inputtag/Tag";
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { ipaddress } from '../../Globals';

export default class GeneratedTasks extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      showLoadingScreen: true
    }
  }

  componentDidMount() {

    NetInfo.isConnected.fetch().then((isConnected) => {

      if(isConnected) {

        timeout(10000, 
          fetch('http://' + ipaddress() + ':3000/task/user/' + User.get()._id, {
              method : 'get',
              headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
              }
          })
          .then((response) => response.json())
          .then((res) => {
            console.log(res);
            if(res.status == 200) {
            
              this.setState({
                tasks: res.data,
                showLoadingScreen: false
              },
              () => console.log(this.state.tasks));

            } else {

              alert(res.data);   
            }       
          })
          .catch((error) => {
              alert(error);
          })
        ).catch((error) => {

            alert("Server not responding.");
        });

      } else {
        ToastAndroid.show('No Internet Connection!', ToastAndroid.SHORT);
      }
    });
  }

  render() {
    if(this.state.showLoadingScreen == true)
      return (
        <LoadingComponent />
      );
    else
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.tasks}
            keyExtractor={item => item._id}
            renderItem={({item}) => 
              <View style={{backgroundColor: '#de8d47', borderBottomWidth: 2, borderColor: '#1c1f24'}}>
                <Text style={{fontSize: 25,color: '#201f1d'}} >{item.title}</Text>
                <View style={{backgroundColor: '#ffffff', height: 45}}>
                  <Text style={{fontSize: 18,color: '#868685'}} >{item.description}</Text>
                </View>
                <View style={styles.tagAreaContainer}>
                  {item.skills.map((tag, i) => (
                    <Tag
                      key={i}
                      label={tag.name}
                      tagContainerStyle={{flexDirection: 'column', height: 27 }}
                      tagTextStyle={{textAlign: 'center'}}
                    />
                  ))}
                </View>
                <TouchableOpacity style={ styles.button} onPress={() => Actions.edittask({task: item})}>
                  <Text style={styles.textBtn}>Edit Task</Text>
                </TouchableOpacity>
              </View>
              }
            />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#1c1f24',
    flex: 1,
    paddingTop: 30
  },
  col : {
    flex: 1/2,
    alignItems: 'center',
    justifyContent: 'space-around' ,
  },
  tagAreaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: '#000'
  },
  textBtn: {
    fontSize: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff' ,
    paddingBottom: 8
  },
  button : {
    height: 50,
    backgroundColor:'#f44336',
    borderRadius: 0,
    padding: 11,
    borderWidth: 1,
    borderColor: '#000000'
  }
});