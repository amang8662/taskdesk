import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import User from '../models/User';

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/uploads/avatar/')
  },
  filename: function(req, file, callback) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return err;
      callback(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
    });
  }
});  

exports.updateavatar = function(req, res) {

  var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {

      var ext = path.extname(file.originalname)
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images can be uploaded.'))
      }
      callback(null, true)
    }
  }).single('avatar');

  User.findById(req.params.userId, function (err, user) {

    if(err) {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
            status: 404,
            data: "User not found"
          });                
      } else {
        return res.status(500).send({
            status: 500,
            data: "Error Updating User"
        });
      }
    } else {

      if(!user) {
          return res.status(404).send({
              status: 404,
              data: "User not found"
          });            
      } else {

        upload(req, res, function(err) {
          if (err) {
            return res.status(500).send({
                status: 500,
                data: err.message || "File Upload Failed"
            });
          } else {

            user.set({ avatar: req.file.filename });
            user.save(function (err, updatedUser) {
              if (err) 
                return res.status(500).send({
                  status: 500,
                  data: "Error Updating User"
                });
              User.findOne(updatedUser._id).populate('skills').exec(function(err, result){

                return res.status(200).send({
                  status: 200,
                  data: JSON.stringify(result)
                });
              });
            });            
          }
        });
      }
    }
  });
};

exports.findbyid = function(req, res) {
  
  User.findById(req.params.userId)
  .populate('skills')
  .exec(function (err, user) {
    if (err) {
      if(err.kind === 'ObjectId') {
       
          return res.status(404).send({
              status: 404,
              data: "User not found"
          });                
      }
      return res.status(500).send({
          status: 500,
          data: "Error retrieving user"
      });

    } else {
      if(!user) {
          return res.status(404).send({
              status: 404,
              data: "User not found"
          });            
      }
      res.status(200).send({
        status: 200,
        data: user
      });
    }
  });
};

exports.update = function(req, res) {

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email does not appear to be valid').isEmail();
  
  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {

    return res.status(400).send({ 
      status: 400,
      errortype: 'validation',
      data:  errors
    });

  } else {

    var userdata = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email
    }

    if(req.body.hasOwnProperty("title")) {
      userdata.title = req.body.title;
    }
    if(req.body.hasOwnProperty("about")) {
      userdata.about = req.body.about;
    }
    if(req.body.hasOwnProperty("skills") && req.body.skills.length > 0) {
      userdata.skills = JSON.parse(req.body.skills);
    } else if(req.body.skills) {
      userdata.skills = [];
    }

    User.findByIdAndUpdate(req.params.userId, userdata, {new: true})
    .populate('skills')
    .exec( function(err, user) {

      if(err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
              status: 404,
              data: "User not found"
            });                
        } else if (err.name === 'ValidationError') {

          var error_fields = err.errors;
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
              data: "Error updating User"
          });
        }
      } else {
        if(!user) {
            return res.status(404).send({
                status: 404,
                data: "User not found"
            });            
        }
        res.status(200).send({
          status: 200,
          data: JSON.stringify(user)
        });
      }
    });    
  }
};