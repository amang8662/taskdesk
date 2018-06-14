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
import { baseurl } from '../../Globals';
import { InputText } from './../index';
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