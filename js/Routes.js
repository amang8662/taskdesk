import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { SideMenu } from './components';
//Scenes
import LoadingScreen from './pages/loadingscreen';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';
import TaskInfo from './pages/taskinfo';
import AddTask from './pages/addtask';
import ProfileHome from './pages/profile';
import EditProfile from './pages/editprofile';
import YourTasks from './pages/yourtasks';
import EditTask from './pages/edittask';
import AboutUs from './pages/aboutus';
import GeneratedTasks from './pages/generatedtasks';
import Proposals from './pages/proposals';
import ProposalInfo from './pages/proposalinfo';

//Admin Scene
import AddSkill from './pages/addskill';

const iconDashBoard = ({ tintColor }) => { return <Icon name="dashboard" size={25} color={tintColor} />}
const iconPerson = ({ tintColor }) => { return <Icon name="user" size={25} color={tintColor} />}
const iconAddCircle = ({ tintColor }) => { return <Icon name="plus" size={25} color={tintColor} />}

export default class Routes extends Component<{}> {
	render() {
		return(
			<Router>
				<Scene key="root" >
					<Scene key="loadingscreen" component={LoadingScreen} title="LoadingScreen" initial  hideNavBar/>
				    <Stack key="unauthenticated" hideNavBar type="reset">
				    	<Scene key="login" component={Login} title="Login" initial />
				    	<Scene key="signup" component={Signup} title="Register"/>
				    </Stack>
				    <Scene key="authenticated" hideNavBar type="reset">
    			    	<Scene key="drawer" drawer contentComponent={SideMenu} drawerPosition="left" drawerWidth={240}  initial hideDrawerButton={true}>
    			    		
    			    		<Stack key="dashboard" tabBarIcon={iconDashBoard} title="DashBoard" initial>
    		    				<Scene key="home" component={Home} title="Home" initial hideNavBar/>
    		    				<Scene key="taskinfo" component={TaskInfo} title="TaskInfo" hideNavBar/>
    			    		</Stack>
    			    		
    		    			
    		    			<Stack key="profile" title="Profile" tabBarIcon={iconPerson}>
    		    				<Scene key="profilehome" component={ProfileHome} initial hideNavBar/>
    		    				<Scene key="editprofile" component={EditProfile} hideNavBar title="Edit Profile"/>
    		    			</Stack>
	    			    	

	    			    	<Stack key="task" >
	    			    		<Scene key="generatedtasks" component={GeneratedTasks} title="Generated Tasks" initial hideNavBar/>
	    			    		<Scene key="addtask" component={AddTask} tabBarIcon={iconAddCircle} hideNavBar title="Add Task"/>
	    			    		<Scene key="edittask" component={EditTask} hideNavBar title="Edit Task"/>
	    			    		<Scene key="proposals" component={Proposals} hideNavBar title="Proposals"/>
	    			    		<Scene key="proposalinfo" component={ProposalInfo} hideNavBar title="Proposal Info"/>
    			    		</Stack>

    			    		<Scene key="yourtasks" component={YourTasks} hideNavBar title="Your Tasks"/>
    			    		<Scene key="aboutus" component={AboutUs} title="About Us"/>
    			    		<Scene key="addskill" component={AddSkill} title="Add Skill"/>
    			    	</Scene>
					</Scene>
				</Scene>
			</Router>
		)
	}
}