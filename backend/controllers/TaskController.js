import mongoose from 'mongoose';
import Task from '../models/Task';

exports.add = function(req, res) {
  
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


exports.findbyid = function(req, res) {
  
  Task.findById(req.params.taskId)
  .populate('skills')
  .exec(function (err, task) {
    if (err) {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              status: 404,
              data: "Task not found with id " + req.params.taskId
          });                
      }
      return res.status(500).send({
          status: 500,
          data: "Error retrieving task with id " + req.params.taskId
      });

    } else {
      if(!task) {
          return res.status(404).send({
              status: 404,
              data: "Task not found with id " + req.params.taskId
          });            
      }
      res.status(200).send({
        status: 200,
        data: task
      });
    }
  });
};

exports.update = function(req, res) {
  
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  req.checkBody('skills', 'Skills are required').notEmpty();
  // req.checkBody('skills', 'Maximum 10 skills allowed').length();
  
  // check the validation object for errors
  var errors = req.validationErrors();

  var resdata = {};

  if (errors) {

    return res.status(400).send({ 
      status: 400,
      errortype: 'validation',
      data:  errors
    });

  } else {

    Task.findByIdAndUpdate(req.params.taskId, {
        title: req.body.title,
        description: req.body.description,
        skills: JSON.parse(req.body.skills)
    }, {new: true})
    .exec( function(err, task) {

      if(err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
              status: 404,
              data: "Task not found with id " + req.params.taskId
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
              data: "Error updating Task with id " + req.params.noteId
          });
        }
      } else {
        if(!task) {
            return res.status(404).send({
                status: 404,
                data: "Task not found with id " + req.params.taskId
            });            
        }
        res.status(200).send({
          status: 200,
          data: "Task Updated Successfully"
        });
      }
    });    
  }
};