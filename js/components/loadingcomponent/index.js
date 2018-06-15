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

export default class LoadingComponent extends Component<{}> {

  constructor(props) {
    super(props);
  }

	render(){
    
    return(
      <View style={styles.container}>
        {this.props.internet ? (
          <View>
            {this.props.hasData ? (
                <View>
                  <Spinner size={50} color='#dc4239' />
                  <Text style={styles.text}>Loading...</Text>
                </View>
              ) : (
                <View style={styles.imageContainer}>
                  <Image style={styles.image}   source={noresultsimg} />
                  <Text style={styles.text}>No Results Found</Text>
                </View>
              )
            }
          </View>
          ) : (
            <View style={styles.imageContainer}>
              <Image style={styles.image}   source={newsfeedimg} />
              <Text style={styles.text}>No Internet Connection</Text>
            </View>
          )
        }
      </View>
    )    
	}
}

LoadingComponent.defaultProps = {
  hasData: true,
  internet: true
};
LoadingComponent.propTypes = {
  hasData: PropTypes.bool,
  internet: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#1c1f24'
  },
  text: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    color: '#A9A9A9'
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