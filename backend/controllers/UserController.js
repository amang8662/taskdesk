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

exports.updateprofilepic = function(req, res) {

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
                  data: result
                });
              });
            });            
          }
        });
      }
    }
  });
};