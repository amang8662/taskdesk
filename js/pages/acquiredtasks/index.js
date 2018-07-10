import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  NetInfo,
  ToastAndroid
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text,
  Card,
  CardItem,
  Tab,
  Tabs,
  ScrollableTab
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { LoadingComponent } from '../../components';
import Tag from "../../components/inputtag/Tag";
import { validate, timeout } from '../../modules';
import User from '../../helpers/User';
import { baseurl } from '../../Globals';
import { styles } from "./styles";
import AppliedList from "./appliedlist";
import WorkingList from "./workinglist";
import SubmittedList from "./submittedlist";
import CompletedList from "./completedlist";

export default class AcquiredTasks extends Component<{}> {

 constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header hasTabs style={{ backgroundColor: "#dc4239" }} androidStatusBarColor="#dc2015" iosBarStyle="light-content"        >
          <Left>
            <Button transparent onPress={() => Actions.drawerOpen()}>
              <Icon name="md-menu" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "#F2F2F2" }}> Acquired Tasks</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => Actions.profile()}>
              <Icon name="md-contact" style={{ color: "#FFF", fontSize: 30,alignItems:  'center' }} />
            </Button>
          </Right>
        </Header>
        <Tabs initialPage={0} renderTabBar={()=> <ScrollableTab />} locked>
          <Tab heading="Applied" page 
            tabStyle={styles.tab.tabStyle}
            textStyle={styles.tab.textStyle} 
            activeTabStyle={styles.tab.activeTabStyle}
            activeTextStyle={styles.tab.activeTextStyle}>
            
            <AppliedList />
          </Tab>
          <Tab heading="Working" page 
            tabStyle={styles.tab.tabStyle}
            textStyle={styles.tab.textStyle} 
            activeTabStyle={styles.tab.activeTabStyle}
            activeTextStyle={styles.tab.activeTextStyle}>
            
            <WorkingList />
          </Tab>
          <Tab heading="Submitted" page 
            tabStyle={styles.tab.tabStyle}
            textStyle={styles.tab.textStyle} 
            activeTabStyle={styles.tab.activeTabStyle}
            activeTextStyle={styles.tab.activeTextStyle}>
            
            <SubmittedList />
          </Tab> 
          <Tab heading="Completed" page
            tabStyle={styles.tab.tabStyle}
            textStyle={styles.tab.textStyle} 
            activeTabStyle={styles.tab.activeTabStyle}
            activeTextStyle={styles.tab.activeTextStyle}>
            
            <CompletedList />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}