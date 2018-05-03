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
    			    		<Scene key="tabs" tabs tabBarPosition="bottom" showIcon={true}>
	    			    		<Stack key="dashboard" tabBarIcon={iconDashBoard} title="DashBoard" initial>
	    		    				<Scene key="home" component={Home} title="Home" initial hideNavBar/>
	    		    				<Scene key="taskinfo" component={TaskInfo} title="TaskInfo"/>
	    			    		</Stack>
	    			    		
	    			    		<Scene key="addtask" component={AddTask} tabBarIcon={iconAddCircle} title="Add Task"/>
	    		    			
	    		    			<Stack key="profile" title="Profile" tabBarIcon={iconPerson}>
	    		    				<Scene key="profilehome" component={ProfileHome} initial hideNavBar/>
	    		    				<Scene key="editprofile" component={EditProfile} title="Edit Profile"/>
	    		    			</Stack>
	    			    	</Scene>

	    			    	<Stack key="task" >
	    			    		<Scene key="generatedtasks" component={GeneratedTasks} title="Generated Tasks" initial hideNavBar/>
	    			    		<Scene key="edittask" component={EditTask} title="Edit Task"/>
    			    		</Stack>

    			    		<Scene key="yourtasks" component={YourTasks} title="Your Tasks"/>
    			    		<Scene key="aboutus" component={AboutUs} title="About Us"/>
    			    		<Scene key="addskill" component={AddSkill} title="Add Skill"/>
    			    	</Scene>
					</Scene>
				</Scene>
			</Router>
		)
	}
}