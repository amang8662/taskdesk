taskdesk

For development on backend:

	bash Directory (~taskdesk/backend):
	List of Ordered Commands/Steps to install dependencies:
		1. cmd - npm install (to install node modules)
		2. start mongodb
		4. cmd - npm start (to start running backend) (base url: http://localhost:3000)


For development on frontend:

	bash Directory (~taskdesk):
	List of Ordered Commands/Steps to install dependencies:
		1. cmd - npm install (to install node modules)
		2. cmd - npm run build (to create Globals.js file in directory ~taskdesk/js)
		3. add your system ip address to Globals.js
		4. cmd - react-native run-android (to start running development)