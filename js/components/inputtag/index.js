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
} from "react-native";
import {
  Button,
  Icon,
} from 'native-base';

import { Toast } from '../../components';
import { validate, timeout } from '../../modules';
import { baseurl } from '../../Globals';
import { InputText } from './../index';
import Tag from "./Tag";
import _ from "lodash";
export default class InputTag extends Component<{}> {
  
  constructor(props) {
    super(props);

    this.state = { 
      tags: props.initialTags,
      text: props.initialText,
      tagList: []
    };
    this.onListPress = this.onListPress.bind(this);
    this.tagDelete = this.tagDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clearTags == true) {
      this.setState({
        tags: [],
        text: '',
        tagList: []
      });
    }

    if (nextProps.clearTagList == true) {
      this.setState({
        text: '',
        tagList: []
      });
    }
  }

  onChangeText = text => {

    this.setState({ text });
    
    if (text.length > 0) {
       
      NetInfo.isConnected.fetch().then((isConnected) => {

        if(isConnected) {

          timeout(10000, 
            fetch(baseurl + '/skill/getbyname' , {
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

              if(res.status == 200) {
              
                this.setState({
                  tagList: res.data
                });

              } else {

                if(res.status == 400) {

                  console.log(res.data);
                } else if(res.status == 500) {
                  
                  alert('Sorry Some Error Occured');
                }    
              }       
            })
            .catch((error) => {
                console.log(error);
            })
          ).catch((error) => {

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

  tagDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag,index) => index !== i)
    },
      () =>
        this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
    );
  }

  render() {

    return (
        <View style={styles.container}>
          <View style={[styles.tagAreaContainer, this.props.tagAreaContainerStyle]}>
            {this.state.tags.map((tag, i) => (
              <Tag
                key={i}
                label={tag.name}
                tagContainerStyle={this.props.tagContainerStyle}
                tagTextStyle={this.props.tagTextStyle}
                onClose={() => this.tagDelete(i)}
                showCloseButton={this.props.showTagCloseButton}
              />
            ))}
          </View>
          {!this.props.readonly && (
            <View>
              <InputText
                value={this.state.text}
                isError={this.props.isError}
                onChangeText={this.onChangeText}
                placeholder="Add skill Tags"
                underlineColorAndroid="rgba(0,0,0,0)"
                ref={this.props.inputRef}
                {...this.props}
              />
              <FlatList style={{flexDirection: 'column',flexWrap: 'wrap',}}
                data={this.state.tagList}
                keyExtractor={item => item._id}
                renderItem={({item}) => 
                  <Button style={styles.tagListItem} onPress={() => this.onListPress(item)}>
                    <Text style={styles.tagListItemText}>{item.name}</Text>
                  </Button>
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
  readonly: false,
  showTagCloseButton: false
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
  readonly: PropTypes.bool,
  showTagCloseButton: PropTypes.bool
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: '100%',
        paddingTop: 10
    },
    tagAreaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: '#fff'
    },
    tagListItem: {
      margin: 5,
      width: '90%',
      backgroundColor: '#999',
    },
    tagListItemText: {
      fontSize: 22,
      color: '#fff',
      padding: 20  
    },
});