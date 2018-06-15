import React, { Component } from "react";
import PropTypes from "prop-types";
import {  View, StyleSheet } from "react-native";
import { Text, Button, Icon } from 'native-base';


export default class Tag extends Component<{}> {

  render() {
    return (
        <Button style={[styles.tag, this.props.tagContainerStyle]}>
          <Text style={[styles.tagLabel, this.props.tagTextStyle]}>{this.props.label}</Text>
          {this.props.showCloseButton && (
            <Button style={styles.tagIcon} onPress={this.props.onClose}>
              <Icon name="close"  />
            </Button>
          )}
        </Button>
      );
  }
}

Tag.defaultProps = {
  showCloseButton: false
};

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
  showCloseButton: PropTypes.bool
};

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#f44336",
    minWidth: '25%',
    margin: 5,
    elevation: 10
  },
  tagLabel: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold'
  },
  tagIcon:{
    backgroundColor: '#00000000',
    borderRadius: 100,
    alignSelf: 'center',
  }
  
});

export { Tag };