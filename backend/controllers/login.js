import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';

exports.login = function(req, res) {

  req.checkBody('username', 'Username is required').notEmpty();
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

    User.findOne({$or:[ {'username': req.body.username}, {'email': req.body.username} ]})
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        resdata = {
          status: false,
          errortype: 'db-error',
          data: ''
        };
        res.json(resdata);
      } else if (!user) {
        resdata = {
          status: false,
          errortype: 'no-user-error',
          data: ''
        };
        res.json(resdata);
      } else {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
          var data = {};
          if (result === true) {
            data = {
              status: true,
              data: JSON.stringify(user)
            };
          } else {
            data = {
              status: false,
              errortype: 'password-error',
              data: ''
            };
          }
          res.json(data);
        })
      }
    });
  }
};