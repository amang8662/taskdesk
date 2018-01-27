import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';

import LoadingScreen from './pages/loadingscreen';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';

export default class Routes extends Component<{}> {
	render() {
		return(
			<Router>
				<Scene key="root" >
					<Scene key="loadingscreen" component={LoadingScreen} title="LoadingScreen" initial={true}  hideNavBar={true}/>
				    <Stack key="unauthenticated" hideNavBar={true} type="reset">
				      <Scene key="login" component={Login} title="Login" initial={true}/>
				      <Scene key="signup" component={Signup} title="Register"/>
				    </Stack>
				    <Stack key="authenticated" hideNavBar={true} type="reset">
				      <Scene key="home" component={Home} title="Home" initial={true}/>
				    </Stack>
				</Scene>
			 </Router>
			)
	}
}