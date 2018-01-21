import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import router from './router';

//Add Global Promise
mongoose.Promise = global.Promise;
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taskdesk', {useMongoClient: true})
.then(
  () => { console.log("Mongoose Connected to db"); },
  err => { console.log("Error while Connecting to db" + err); }
);

// Initialize http server
const app = express();

// Logger that outputs all requests into the console
app.use(morgan('combined'));
// Use v1 as prefix for all API endpoints
app.use('/', router);

// Launch the server on port 3000
const server = app.listen(3000, () => {
  const { port } = server.address();
  console.log(`Listening at http://localhost:${port}`);
});