import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Tag extends Component<{}> {

  render() {
    return (
        <TouchableOpacity style={[styles.tag, this.props.tagContainerStyle]}>
          <Text style={[styles.tagLabel, this.props.tagTextStyle]}>{this.props.label}</Text>
          {this.props.showCloseButton && (
            <TouchableOpacity onPress={this.props.onClose}>
              <Icon name="close" size={15} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 12,
    height: 32,
    margin: 4
  },
  tagLabel: {
    flex: 0.7,
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.87)"
  },
  tagClose: {
    flex: 0.3
  }
});

export { Tag };