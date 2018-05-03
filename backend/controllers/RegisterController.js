import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';

const saltRounds = 10;

var RegisterController = {};

RegisterController.register = function(req, res) {

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email does not appear to be valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  
  // check the validation object for errors
  var errors = req.validationErrors();

  var resdata = {};

  if (errors) {

    resdata =  { 
      status: false,
      errortype: 'validation',
      message:  errors 
    };

    res.json(resdata);
  } else {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if(err) {
        var hashdata = { 
          status: false,
          errortype: 'hash-error',
          message: err
        };

        res.json(hashdata);
      } else {
        var userdata = {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: hash,
        };

        var user = new User(userdata);
        user.save(function (error) {

          var data = {};
          if(error) {
            console.log(error);
            if (error.name === 'ValidationError') {

              var error_fields = error.errors;
              for(var key in error_fields) {
                error_fields[key] = true;
              }
              data =  { 
                status: false,
                errortype: 'unique-error',
                fields: error_fields
              };
            } else {

              data =  { 
                status: false,
                errortype: 'db-error'
              };
            }
          } else {

            data =  {
              status: true,
              message:  "User Registered Successfully.." 
            };
          }

          res.json(data);
        });
      }
    });
    
  }
};

module.exports = RegisterController;