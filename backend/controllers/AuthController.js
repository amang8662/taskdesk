import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';

const saltRounds = 10;

exports.register = function(req, res) {

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('contact', 'Contact is required').notEmpty();
  req.checkBody({
    contact: {
      matches: {
        options: /^[789]\d{9}$/,
        errorMessage: 'Contact does not appear to be valid'
      }
    }
  })
  req.checkBody('password', 'Password is required').notEmpty();
  
  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {

    return res.status(400).send({ 
      status: 400,
      errortype: 'validation',
      data:  errors,
      message: "Please Enter Valid Details"
    });

  } else {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if(err) {

        return res.status(500).send({ 
          status: 500,
          errortype: 'hash-error',
          message: err
        });

      } else {
        var userdata = {
          name: req.body.name,
          username: req.body.username,
          contact: req.body.contact,
          password: hash,
        };

        var user = new User(userdata);
        user.save(function (error) {

          if(error) {
            if (error.name === 'ValidationError') {

              var error_fields = error.errors;
              for(var key in error_fields) {
                error_fields[key] = true;
              }
              return res.status(500).send({ 
                status: 500,
                errortype: 'unique-error',
                data: {
                  fields: error_fields
                }
              });
            } else {

              return res.status(500).send({ 
                status: 500,
                errortype: 'db-error',
                message: "Error registering User"
              });
            }
          } else {

            return res.status(200).send({
              status: 200,
              message:  "User Registered Successfully.." 
            });
          }
        });
      }
    });
    
  }
};

exports.login = function(req, res) {

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  
  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {

    return res.status(400).send({ 
      status: 400,
      errortype: 'validation',
      data:  errors,
      message: "Please Enter Valid Details"
    });
  } else {

    User.findOne({$or:[ {'username': req.body.username}, {'contact': req.body.username} ]})
    .populate('skills')
    .exec(function (err, user) {
      if (err) {
        return res.status(500).send({
          status: 500,
          errortype: 'db-error',
          message: "Error Logging in"
        });
      } else {

        if (!user) {
          return res.status(404).send({
            status: 404,
            message: "Username/Email is not registered"
          });
          
        } else {
          bcrypt.compare(req.body.password, user.password, function (err, result) {
            
            if (result === true) {
              return res.status(200).send({
                status: 200,
                data: JSON.stringify(user),
                message: "User Logged In Successfully"
              });
            } else {
              return res.status(401).send({
                status: 401,
                message: "Invalid Credentials"
              });
            }
          })
        }
      }
    });
  }
};