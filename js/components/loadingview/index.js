import React, { Component } from 'react';
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import { Spinner } from 'native-base';

const newsfeedimg = require('../../img/newsfeed.png');
const noresultsimg = require('../../img/noresults.png');
const error500 = require('../../img/error500.png');

export default class LoadingView extends Component<{}> {

  constructor(props) {
    super(props);
  }

	render(){
    
  switch(this.props.status) {
    case 100: return (
       // Initial Loading State
         <View style={styles.container}>
           <View>
             <Spinner size={40} color='#dc4239' />
             <Text style={styles.text}>Loading...</Text>
           </View>
         </View>
       );
    case 150: return (
       // No Internet Connection
         <View style={styles.container}>
           <View style={styles.imageContainer}>
             <Image style={styles.image}   source={newsfeedimg} />
             <Text style={styles.text}>No Internet Connection</Text>
           </View>
         </View>
       );
    case 200: return this.props.children;
    case 404: return (
        <View style={styles.container}>
           <View style={styles.imageContainer}>
             <Image style={styles.image}   source={noresultsimg} />
             <Text style={styles.text}>No Results Found</Text>
           </View>
        </View>
       );
    case 408: return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image style={[styles.image, {borderRadius: 10}]}   source={error500} />
            <Text style={styles.text}>Request Timeout</Text>
          </View>
        </View>
       );
    case 500: return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image style={[styles.image, {borderRadius: 10}]}   source={error500} />
            <Text style={styles.text}>Server Error Occured</Text>
          </View>
        </View>
       );
    case 505: return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image style={[styles.image, {borderRadius: 10}]}   source={error500} />
            <Text style={styles.text}>Error while making request</Text>
          </View>
        </View>
       );
    default: return null;
   }  
	}
}

LoadingView.defaultProps = {
  status: 100
};
LoadingView.propTypes = {
  status: PropTypes.number
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  text: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    color: '#686868'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width:130,
    height:130,
    marginBottom: 5
  }
});