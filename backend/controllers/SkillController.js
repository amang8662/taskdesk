import mongoose from 'mongoose';
import Skill from '../models/Skill';

exports.add = function(req, res) {
  
  req.checkBody('name', 'Skill Name is required').notEmpty();
  
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

    var skilldata = {
      name: req.body.name
    };
    
    var skill = new Skill(skilldata);
    skill.save(function (error) {

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
          message:  "Skill Added Successfully.." 
        };
      }

      res.json(data);
        
    });
    
  }
};

exports.getByName = function(req, res) {

  req.checkBody('name', 'Skill Name is required').notEmpty();
  
  // check the validation object for errors
  var errors = req.validationErrors();

  var resdata = {};

  if (errors) {

    resdata =  { 
      status: false,
      errortype: 'validation',
      data:  errors 
    };

    res.json(resdata);
  } else {

    Skill.find({name: { $regex: '.*' + req.body.name + '.*', $options: 'i' }})
    .limit(5)
    .exec(function (err, skills) {
      if (err) {

        console.log(err);
        resdata = {
          status: false,
          errortype: 'db-error',
          data: ''
        };
      } else if (!skills || skills.length == 0) {
        resdata = {
          status: false,
          errortype: 'no-skills-error',
          data: ''
        };
        
      } else {
        
        resdata = {
          status: true,
          data: skills
        };
      }
      res.json(resdata);
    });
    
  }
};