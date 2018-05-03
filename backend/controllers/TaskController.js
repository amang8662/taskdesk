import mongoose from 'mongoose';
import Task from '../models/Task';

var TaskController = {};

TaskController.add = function(req, res) {
  
  req.checkBody('user', 'UserData is required').notEmpty();
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  req.checkBody('skills', 'Skills are required').notEmpty();
  // req.checkBody('skills', 'Maximum 10 skills allowed').length();
  
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

    var rewardscore = req.body.user.level * 2;

    var taskdata = {
      task_creater: req.body.user._id,
      title: req.body.title,
      description: req.body.description,
      rewardscore: rewardscore,
      skills: JSON.parse(req.body.skills)
    };
    console.log(taskdata);
    var task = new Task(taskdata);
    task.save(function (error) {

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
          message:  "Task Added Successfully.." 
        };
      }

      res.json(data);
        
    });
    
  }
};

module.exports = TaskController;