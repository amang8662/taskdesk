import React, { Component } from 'react';

export default class User extends Component<{}> {

  constructor(props) {
    super(props);

  }

  static user = {};

  static get() {
    return user;
  }

  static set(data) {
    user = JSON.parse(data);
  }


  render() {
    return null;
  }
}