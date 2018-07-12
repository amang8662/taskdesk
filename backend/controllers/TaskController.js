import mongoose from 'mongoose';
import Task from '../models/Task';
import User from '../models/User';

// Pagination limit

function paginationOptions(page, limit) {
  return {
    page: (Math.abs(page) || 1) - 1,
    limit: Math.abs(limit) || 20
  }
}

exports.add = function(req, res) {
  
  req.checkBody('user', 'UserData is required').notEmpty();
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  req.checkBody('payment', 'Payment is required').notEmpty();
  req.checkBody('payment', 'Payment must be a number').isInt();
  req.checkBody('skills', 'Skills are required').notEmpty();
  // req.checkBody('skills', 'Maximum 10 skills allowed').length();
  
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

    var rewardscore = req.body.user.level * 2;

    var taskdata = {
      task_creater: req.body.user._id,
      title: req.body.title,
      description: req.body.description,
      payment: req.body.payment,
      rewardscore: rewardscore,
      skills: JSON.parse(req.body.skills)
    };
    
    var task = new Task(taskdata);
    task.save(function (error) {

      if(error) {
        console.log(error);
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
            },
            message: "Fields must be unique"
          });
        } else {

          return res.status(500).send({ 
            status: 500,
            errortype: 'db-error',
            message: err.message || "Error adding Task"
          });
        }
      } else {

        return res.status(200).send({ 
          status: 200,
          message: "Task Added Successfully.."
        });
      }        
    });
    
  }
};

exports.findallexceptuser = function(req, res) {

  var pageOptions = paginationOptions(req.query.page, req.query.limit);
  
  Task.find({
    $and: [
      {task_creater: { "$ne": req.params.userId}},
      {status: 0}
    ]
  })
  .select('-proposals._id -proposals.description -proposals.createdAt')
  .sort({createdAt: 'desc'})
  .skip(pageOptions.page*pageOptions.limit)
  .limit(pageOptions.limit)
  .populate('task_creater')
  .populate('skills')
  .exec(function (err, tasks) {
    if (err) {
      return res.status(500).send({
          status: 500,
          message: err.message || "Error retrieving tasks"
      });

    } else {
      if(!tasks || tasks.length <= 0) {
          return res.status(404).send({
              status: 404,
              message: "No Tasks found"
          });            
      }
      res.status(200).send({
        status: 200,
        data: {
          page: pageOptions.page + 1,
          limit: pageOptions.limit,
          tasks: tasks
        }
      });
    }
  });
};

exports.findbyuser = function(req, res) {

  var pageOptions = paginationOptions(req.query.page, req.query.limit);

  var whereClause = {};

  if(req.query.taskstatus) {

    whereClause = {
      $and: [
          { task_creater: req.params.userId },
          { status: Number(req.query.taskstatus) }
      ]    
    }
  } else {
    whereClause = {
      task_creater: req.params.userId 
    }
  }
  
  Task.find(whereClause)
  .select('-proposals._id -proposals.description -proposals.createdAt')
  .sort({updatedAt: 'desc'})
  .skip(pageOptions.page*pageOptions.limit)
  .limit(pageOptions.limit)
  .populate('task_creater')
  .populate('skills')
  .exec(function (err, tasks) {
    if (err) {
      return res.status(500).send({
          status: 500,
          message: err.message || "Error retrieving tasks"
      });

    } else {
      if(!tasks || tasks.length <= 0) {
          return res.status(404).send({
              status: 404,
              message: "No Tasks found"
          });            
      } 
      else {
        res.status(200).send({
          status: 200,
          data: {
            page: pageOptions.page + 1,
            limit: pageOptions.limit,
            tasks: tasks
          }
        });
      }
    }
  });
};

exports.findbyid = function(req, res) {
  
  Task.findById(req.params.taskId)
  .select('-proposals')
  .populate('skills')
  .exec(function (err, task) {
    if (err) {
      if(err.kind === 'ObjectId') {
       
          return res.status(404).send({
              status: 404,
              message: "Task not found"
          });                
      }
      return res.status(500).send({
          status: 500,
          message: "Error retrieving task"
      });

    } else {
      if(!task) {
          return res.status(404).send({
              status: 404,
              message: "Task not found"
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
  req.checkBody('payment', 'Payment is required').notEmpty();
  req.checkBody('payment', 'Payment must be a number').isInt();
  req.checkBody('skills', 'Skills are required').notEmpty();
  // req.checkBody('skills', 'Maximum 10 skills allowed').length();
  
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

    Task.findByIdAndUpdate(req.params.taskId, {
        title: req.body.title,
        description: req.body.description,
        payment: req.body.payment,
        skills: JSON.parse(req.body.skills)
    }, {new: true})
    .exec( function(err, task) {

      if(err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
              status: 404,
              message: "Task not found"
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
              message: "Error updating Task"
          });
        }
      } else {
        if(!task) {
            return res.status(404).send({
                status: 404,
                message: "Task not found"
            });            
        }
        res.status(200).send({
          status: 200,
          message: "Task Updated Successfully"
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

  if (errors) {

    return res.status(400).send({ 
      status: 400,
      errortype: 'validation',
      data:  errors,
      message: "Please Enter Valid Details"
    });

  } else {

    var proposaldata = {
      user: req.body.userid,
      description: req.body.description
    };
   
    Task.findOneAndUpdate({
      _id: req.params.taskId,
      'proposals.user': {
        $ne: req.body.userid
      }
    },
    {
      $push: { proposals: proposaldata }
    })
    .exec( function(err, task) {

      if(err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
              status: 404,
              message: "Task not found"
            });                
        } else if (err.name === 'ValidationError') {

          return res.status(500).send({
              status: 500,
              errortype: 'unique-error',
              message: "You have already applied for the Task"
          });
        } else {
          return res.status(500).send({
              status: 500,
              message: "Error updating Task"
          });
        }
      } else {
        if(!task) {
            return res.status(404).send({
                status: 404,
                message: "Task not found"
            });            
        }
        res.status(200).send({
          status: 200,
          message: "Proposal Sent Successfully"
        });
      }
    });     
  }
};

exports.findproposalsbytask = function(req, res) {
  
  Task.findById(req.params.taskId, "task_taker proposals")
  .populate({ 
    path: 'proposals.user', 
    select: '_id name title avatar level'
  })
  .exec(function (err, task) {
    if (err) {
      if(err.kind === 'ObjectId') {
       
          return res.status(404).send({
              status: 404,
              message: "Task not found"
          });                
      }
      return res.status(500).send({
          status: 500,
          message: "Error retrieving task"
      });

    } else {
      if(!task) {
          return res.status(404).send({
              status: 404,
              message: "Task not found"
          });            
      } else if(task.proposals.length == 0) {
        return res.status(404).send({
            status: 404,
            message: "Proposals not found"
        });            
      } else {   
        res.status(200).send({
          status: 200,
          data: task.proposals
        });
      }
    }
  });
};

exports.selectproposal = function(req, res) {
  
  req.checkBody('userid', 'Userid is required').notEmpty();
  
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

    Task.findOneAndUpdate({
      $and: [
          { _id: req.params.taskId },
          { status: 0 }
      ]
    }, 
    {
      task_taker: req.body.userid,
      status: 1
    })
    .exec( function(err, task) {

      if(err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
              status: 404,
              message: "Task not found"
            });                
        } else {
          return res.status(500).send({
              status: 500,
              message: "Error selecting Proposal"
          });
        }
      } else {
        if(!task) {
            return res.status(404).send({
                status: 404,
                message: "Task not found"
            });            
        }
        res.status(200).send({
          status: 200,
          message: "Proposal Selected Successfully"
        });
      }
    });    
  }
};

exports.getacquiredtasks = function(req, res) {

  var pageOptions = paginationOptions(req.query.page, req.query.limit);

  var whereClause = {};

  if(req.query.taskstatus) {

    if(Number(req.query.taskstatus) == 0) {
      whereClause = {
        $and: [
            { 'proposals.user': req.params.userId },
            { status: 0 }
        ]    
      }
    } else {

      whereClause = {
        $and: [
            { task_taker: req.params.userId },
            { status: Number(req.query.taskstatus) }
        ]    
      }
    }
  } else {
    whereClause = {
      task_taker: req.params.userId 
    }
  }
  
  Task.find(whereClause)
  .select('-proposals')
  .sort({createdAt: 'desc'})
  .skip(pageOptions.page*pageOptions.limit)
  .limit(pageOptions.limit)
  .populate('task_creater')
  .populate('skills')
  .exec(function (err, tasks) {
    if (err) {
      return res.status(500).send({
          status: 500,
          message: err.message || "Error retrieving tasks"
      });

    } else {
      if(!tasks || tasks.length <= 0) {
          return res.status(404).send({
              status: 404,
              message: "No Tasks found"
          });            
      }
      res.status(200).send({
        status: 200,
        data: {
          page: pageOptions.page + 1,
          limit: pageOptions.limit,
          tasks: tasks
        }
      });
    }
  });
};

exports.submittask = function(req, res) {
  
  Task.findByIdAndUpdate(req.params.taskId, {
      status: 2
  })
  .exec( function(err, task) {

    if(err) {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
            status: 404,
            message: "Task not found"
          });                
      } else {
        return res.status(500).send({
            status: 500,
            message: "Error submitting Task"
        });
      }
    } else {
      if(!task) {
          return res.status(404).send({
              status: 404,
              message: "Task not found"
          });            
      }
      res.status(200).send({
        status: 200,
        message: "Task Submitted Successfully"
      });
    }
  });    
};

exports.approvetask = function(req, res) {
  
  Task.findOneAndUpdate({ _id: req.params.taskId, status: 2 }, { status: 3})
  .exec( function(err, task) {

    if(err) {

      return res.status(500).send({
          status: 500,
          message: "Error Approving Task"
      });
    } else {
      if(!task) {
          return res.status(404).send({
              status: 404,
              message: "Task not found"
          });            
      } else {

        User.findById(task.task_taker)
        .exec( function(err, user) {

          if(err) {
            return res.status(500).send({
                status: 500,
                message: "Error Approving Task"
            });
          } else {
            if(!user) {
                return res.status(404).send({
                    status: 404,
                    message: "User not found"
                });            
            } else {

              var inc = checkScore(user.level, user.score + task.rewardscore)

              user.score += task.rewardscore;

              if(inc == true)
                user.level++;

              user.save(function(err) {
                if(err) {

                  Task.findByIdAndUpdate(req.params.taskId, { status: 2})
                  .exec()
                  return res.status(500).send({
                      status: 500,
                      message: "Error Approving Task"
                  });
                } else {
                  res.status(200).send({
                    status: 200,
                    message: "Task Approved Successfully"
                  });
                }
              })
            }
          }
        });
      }
    }
  });    
};

function checkScore(level, score) {

  var base = 10;
  var boundary = 0;
  for(var i=0; i<level; i++) {
    boundary += base*level*level;
  }

  if(score >= boundary) {
    return true;
  } else {
    return false;
  }

}