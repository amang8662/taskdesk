import mongoose from 'mongoose';
import Skill from '../models/Skill';

exports.add = function(req, res) {
  
  req.checkBody('name', 'Skill Name is required').notEmpty();
  
  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {

    return res.status(400).send({ 
      status: 400,
      errortype: 'validation',
      data:  errors
    });
  } else {

    var skilldata = {
      name: req.body.name
    };
    
    var skill = new Skill(skilldata);
    skill.save(function (error) {

      if(error) {
        if (error.name === 'ValidationError') {

          var error_fields = error.errors;
          for(var key in error_fields) {
            error_fields[key] = true;
          }
         return res.status(500).send({ 
            status: 500,
            errortype: 'unique-error',
            fields: error_fields
          });
        } else {

          return res.status(500).send({ 
            status: 500,
            errortype: 'db-error',
            message: "Error Saving Skill"
          });
        }
      } else {

        return res.status(200).send({
          status: 200,
          message:  "Skill Added Successfully.." 
        });
      }        
    });
    
  }
};

exports.getByName = function(req, res) {

  req.checkBody('name', 'Skill Name is required').notEmpty();
  
  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {

    return res.status(400).send({ 
      status: 400,
      errortype: 'validation',
      data:  errors
    });
  } else {

    Skill.find({name: { $regex: '.*' + req.body.name + '.*', $options: 'i' }})
    .limit(5)
    .exec(function (err, skills) {
      if (err) {

        return res.status(500).send({ 
          status: 500,
          errortype: 'db-error',
          message: "Error retrieving Skills"
        });
      } else if (!skills || skills.length == 0) {
        return res.status(404).send({
          status: 404,
          message: "No skills Found"
        });

      } else {
        
        return res.status(200).send({
          status: 200,
          data: skills
        });
      }
    });
    
  }
};