import React, { Component } from "react";
import PropTypes from "prop-types";
import { 
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  NetInfo,
  ToastAndroid
} from "react-native";

import { validate, timeout } from '../../modules';
import { ipaddress } from '../../Globals';
import Tag from "./Tag";
import _ from "lodash";
export default class InputTag extends Component<{}> {
  state = {};

  constructor(props) {
    super(props);

    this.state = { 
      tags: props.initialTags,
      text: props.initialText,
      tagList: []
    };
    this.onListPress = this.onListPress.bind(this);
  }

  onChangeText = text => {

    this.setState({ text });
    
    if (text.length > 2) {
       
      NetInfo.isConnected.fetch().then((isConnected) => {

        if(isConnected) {

          timeout(10000, 
            fetch('http://' + ipaddress() + ':3000/skill/getbyname' , {
                method : 'post',
                headers : {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
                },
                'body' : JSON.stringify({
                  name : text.toLowerCase()
                })
            })
            .then((response) => response.json())
            .then((res) => {

              if(res.status == true) {
              
                this.setState({
                  tagList: res.data
                });

              } else if(res.status == false) {

                if(res.errortype == 'validation') {

                  console.log(res.data);
                } else if(res.errortype == 'db-error') {
                  
                  alert('Sorry Some Error Occured');
                }    
              }       
            })
            .catch((error) => {
                alert(error);
            })
          ).catch((error) => {

              alert("Server not responding. Try again");
          });

        } else {
          ToastAndroid.show('No Internet Connection!', ToastAndroid.SHORT);
        }
      });
    }
  };

  onListPress(tag) {
    
    this.setState(prevState => (
      {
        tags: _.uniqBy([...prevState.tags, tag], '_id'),
        text: ""
      }),
      () =>
        this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
    );
  }

  render() {

    let inputStyle = this.props.inputStyle ? this.props.inputStyle : styles.inputStyle;
    let errorInputStyle = this.props.errorInputStyle ? this.props.errorInputStyle : styles.errorInputStyle;

    return (
        <View style={styles.container}>
          <View style={[styles.tagAreaContainer, this.props.tagAreaContainerStyle]}>
            {this.state.tags.map((tag, i) => (
              <Tag
                key={i}
                label={tag.name}
                tagContainerStyle={this.props.tagContainerStyle}
                tagTextStyle={this.props.tagTextStyle}
              />
            ))}
          </View>
          {!this.props.readonly && (
            <View>
              <TextInput
                value={this.state.text}
                style={this.props.isError ? errorInputStyle : inputStyle}
                onChangeText={this.onChangeText}
                placeholder="Add Tag"
                underlineColorAndroid="rgba(0,0,0,0)"
                {...this.props}
              />
              <FlatList
                data={this.state.tagList}
                keyExtractor={item => item._id}
                renderItem={({item}) => 
                  <TouchableOpacity style={styles.tagListItem} onPress={() => this.onListPress(item)}>
                    <Text style={styles.tagListItemText}>{item.name}</Text>
                  </TouchableOpacity>
                  }
                />
            </View>
          )}
        </View>
    );
  }
}

InputTag.defaultProps = {
  initialTags: [],
  initialText: "",
  readonly: false
};
InputTag.propTypes = {
  initialText: PropTypes.string,
  initialTags: PropTypes.arrayOf(PropTypes.object),
  onChangeTags: PropTypes.func,
  onTagPress: PropTypes.func,
  containerStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  tagContainerStyle: PropTypes.object,
  tagTextStyle: PropTypes.object,
  readonly: PropTypes.bool
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: 300,
        paddingTop: 10
    },
    tagAreaContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        width: 300,
        backgroundColor: '#fff'
    },
    inputStyle: {
        width:300,
        backgroundColor:'#222',
        borderBottomColor: '#eee',
        borderWidth: 2,
        paddingHorizontal:16,
        fontSize:16,
        color:'#ffffff',
        marginVertical: 10
    },
    errorInputStyle: {
        width:300,
        backgroundColor: '#222',
        borderBottomColor : '#d83c3c',
        borderWidth: 3,
        paddingHorizontal:16,
        fontSize:16,
        marginVertical: 10,
        borderStyle: 'solid',
        color: '#eee'        
    },
    tagListItem: {
      height:50,
      backgroundColor:'#f44336',
      borderStyle: 'solid',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      padding: 10,
      marginTop: 0
    },
    tagListItemText: {
      fontSize: 22,
      textAlign: 'left',
      textAlignVertical: 'center',
      color: '#fff' 
    },
});