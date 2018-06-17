import mongoose from 'mongoose';
import Task from '../models/Task';
import Proposal from '../models/Proposal';

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

exports.findallexceptuser = function(req, res) {
  
  Task.find({'task_creater': { "$ne": req.params.userId}})
  .populate('task_creater')
  .populate('skills')
  .exec(function (err, tasks) {
    if (err) {
      return res.status(500).send({
          status: 500,
          data: err.message || "Error retrieving tasks"
      });

    } else {
      if(!tasks || tasks.length <= 0) {
          return res.status(404).send({
              status: 404,
              data: "No Tasks found"
          });            
      }
      res.status(200).send({
        status: 200,
        data: tasks
      });
    }
  });
};

exports.findbyuser = function(req, res) {
  
  Task.aggregate([
    {
      $match: {
        task_creater: mongoose.Types.ObjectId(req.params.userId)
      }
    },
    {
      "$project": {
        _id: 1,
        task_creater: 1,
        task_taker: 1,
        title: 1,
        description: 1,
        rewardscore: 1,
        status: 1,
        skills: 1,
        proposals: 1,
        createdAt: 1,
        updatedAt: 1,
        nop: { $size: "$proposals"}
      }
    }
  ])
  .exec(function (err, result) {
    if (err) {
      return res.status(500).send({
          status: 500,
          data: err.message || "Error retrieving tasks"
      });

    } else {
      if(!result || result.length <= 0) {
          return res.status(404).send({
              status: 404,
              data: "No Tasks found"
          });            
      } 
      else {
        Task.populate(result, {path: 'skills'}, function(err, tasks) {      
            res.status(200).send({
              status: 200,
              data: tasks
            });
        });
      }
    }
  });
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
              data: "Error updating Task with id " + req.params.taskId
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

exports.savetaskproposal = function(req, res) {
  
  req.checkBody('userid', 'User ID is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  
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

    var proposaldata = {
      user: req.body.userid,
      description: req.body.description
    };
   
    Proposal.create(proposaldata, function (err, proposal) {
      if(err) {
        console.log(err);
        if (err.name === 'ValidationError') {

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
              data: "Error Adding Proposal"
          });
        }
      } else {

        Task.findByIdAndUpdate(req.params.taskId, {
          $addToSet: { proposals: proposal._id  }
        })
        .exec( function(err, task) {

          if(err) {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                  status: 404,
                  data: "Task not found"
                });                
            } else {
              return res.status(500).send({
                  status: 500,
                  data: "Error updating Task"
              });
            }
          } else {
            if(!task) {
                return res.status(404).send({
                    status: 404,
                    data: "Task not found"
                });            
            }
            res.status(200).send({
              status: 200,
              data: "Proposal Sent Successfully"
            });
          }
        });
      }
    });      
  }
};

exports.findproposalsbytask = function(req, res) {
  
  Task.findById(req.params.taskId, "task_taker proposals")
  .populate({
    path: 'proposals',
    populate: { path: 'user', select: 'name title level' }
  })
  .exec(function (err, task) {
    if (err) {
      if(err.kind === 'ObjectId') {
       
          return res.status(404).send({
              status: 404,
              data: "Task not found"
          });                
      }
      return res.status(500).send({
          status: 500,
          data: "Error retrieving task"
      });

    } else {
      if(!task) {
          return res.status(404).send({
              status: 404,
              data: "Task not found"
          });            
      }
      res.status(200).send({
        status: 200,
        data: task
      });
    }
  });
};

exports.findproposalsbyid = function(req, res) {
  
  Proposal.findById(req.params.proposalId)
  .populate('user')
  .exec(function (err, proposal) {
    if (err) {
      if(err.kind === 'ObjectId') {
       
          return res.status(404).send({
              status: 404,
              data: "Proposal not found"
          });                
      }
      return res.status(500).send({
          status: 500,
          data: "Error retrieving proposal"
      });

    } else {
      if(!proposal) {
          return res.status(404).send({
              status: 404,
              data: "Proposal not found"
          });            
      }
      res.status(200).send({
        status: 200,
        data: proposal
      });
    }
  });
};

exports.selectproposal = function(req, res) {
  
  req.checkBody('userid', 'Userid is required').notEmpty();
  
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
        task_taker: req.body.userid,
        status: 1
    })
    .exec( function(err, task) {

      if(err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
              status: 404,
              data: "Task not found"
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
              data: "Error updating Task"
          });
        }
      } else {
        if(!task) {
            return res.status(404).send({
                status: 404,
                data: "Task not found"
            });            
        }
        res.status(200).send({
          status: 200,
          data: "Proposal Selected Successfully"
        });
      }
    });    
  }
};