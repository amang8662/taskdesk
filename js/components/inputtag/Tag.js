import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default class Tag extends Component<{}> {

  render() {
    return (
        <TouchableOpacity style={[styles.tag, this.props.tagContainerStyle]}>
          <Text style={[styles.tagLabel, this.props.tagTextStyle]}>{this.props.label}</Text>
        </TouchableOpacity>
      );
  }
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
  tag: {
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 12,
    height: 32,
    margin: 4
  },
  tagLabel: {
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.87)"
  }
});

export { Tag };