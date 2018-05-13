require("./config/config.js")

const _ = require("lodash")
var express = require("express")
var bodyParser = require("body-parser")
const {ObjectID} =require("mongodb")
var {mongoose} = require("./db/mongoose")
var {Todo} = require("./models/todo")
var {User} = require("./models/user")
var {authenticate} = require("./middleware/authenticate")
const bcrypt = require("bcryptjs")
var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos", authenticate, (req, res)=>{
var todo = new Todo({
    text:req.body.text,
    _creator:req.user._id
})
todo.save().then((doc)=>{
res.send(doc)
}, (e)=>{
res.status(400).send(e.message)
});
});

app.get("/todos", authenticate, (req, res)=>{
    Todo.find({
        _creator:req.user._id
    }).then((todos)=>{
        res.send({todos})
    }, (e)=>{
res.status(400).send(e.message)
    })
})

app.get("/todos/:id", authenticate, (req, res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        console.log('id not valid');
       return res.status(404).send()
    }    
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo)=>{
        if(!todo){
          res.status(404).send()
                    
                 }
                 res.send({todo});
                
            }).catch((e)=>{res.status(400).send()})
    console.log(id);
    
    });

app.delete("/todos/:id", authenticate, (req, res)=>{
const id = req.params.id

if(!ObjectID.isValid(id)){
    return res.status(404).send()
}
Todo.findOneAndRemove({
    _id:id,
    _creator:req.user._id
}).then((todo)=>{
    if(!todo){
        return res.status(404).send()
    }
    
    res.send({todo})
}).catch((e)=>{
    res.status(400).send()
})

})

app.patch("/todos/:id", authenticate, (req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ["text", "completed"])
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }
  if(_.isBoolean(body.completed)&& body.completed){
      body.completedAt = new Date().getTime();

  }  else{
      body.completed = false;
      body.completedAt =null;

  }
  Todo.findOneAndUpdate({
      _id:id,
      _creator:req.user.id
  }, {$set:body}, {new: true}).then((todo)=>{
      if(!todo){
          return res.status(404).send();
      }
      res.send({todo});
  }).catch((e)=>{
      res.status(400).send();
  })
})
///POST /users
app.post("/users", (req, res)=>{
    var body = _.pick(req.body, ["email", "password"])

    var user = new User(body);





    user.save().then(()=>{
      return user.generateAuthToken();
    }).then((token)=>{
        res.header("x-auth", token).send(user);
    }).catch((err)=>{
        
        res.status(400).send(err.message)})
})




app.get("/users/me", authenticate, (req, res)=>{
 res.send(req.user);
});

app.post("/users/login", (req, res)=>{
    var email = req.body.email;
    var password = req.body.password;
   
    
    User.findByCredentials(email, password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header("x-auth", token).send(user);
        })

    }).catch((e)=>{
res.status(400).send();
    })
    // User.findOne({email}).then((user)=>{
       
    //     bcrypt.compare(password, user.password, (err, ans)=>{
    //        if (ans){
    //            console.log(ans);
               
    //         res.send(user)}
    //         else{
    //             res.status(401).send()
    //         }
    //     })
        
        
        
    // })
    
})

app.delete("/users/me/token", authenticate, (req, res)=>{
   req.user.removeToken(req.token).then(()=>{
       res.status(200).send();
   }, ()=>{
       res.status(400).send()
    }) 
})

app.listen(port, ()=>{
    console.log(`started on port ${port}`);
    
});

module.exports = {app}
