const expect = require("expect");
const request = require("supertest")
const {app} =require("./../server");
const {Todo}=require("./../models/todo")
const {User}=require("./../models/user")
const {ObjectID} = require("mongodb")
const {todos, populateTodos, users, populateUsers} = require("./seed/seed")
//testing life cycle method


beforeEach(populateUsers);
beforeEach(populateTodos);
describe("POST /todos", ()=>{
    it("should create a new todo", (done)=>{
        var text = "test todo text";

        request(app)
        .post("/todos")
        .set("x-auth", users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res)=>{
expect(res.body.text).toBe(text);
        })
        .end((err, res)=>{
if(err){
    return done(err)
}
Todo.find({text}).then((todos)=>{
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe(text);
    done();
}).catch((e)=>done(e))
        })
    })
it("should not create todo with invalid body data", (done)=>{
request(app)
.post("/todos")
.set("x-auth", users[0].tokens[0].token)
.send({})
.expect(400)
.end((err, res)=>{
    if(err){
        return done(err)
    }
    Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
    }).catch((e)=>{
        done(e)
    })
})
});


});

describe("GET /todos", ()=>{
    it("should get all todos", (done)=>{
        request(app)
        
        .get("/todos")
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(1)
        })
        .end(done);
    })
})
describe("GET /todos/ :id", ()=>{
    it("should get todo by id", (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text)
        }).end(done);
    })
    it("should not get todo by id from another", (done)=>{
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })
it("should return 404 if todo not found", (done)=>{
request(app)
.get(`/todos/${new ObjectID().toHexString()}`)
.set("x-auth", users[0].tokens[0].token)
.expect(404)
.end(done)
});
it("should return 404 if todo id not valid", (done)=>{
    request(app)
    .get("/todos/123")
    .set("x-auth", users[0].tokens[0].token)
    .expect(404)
    .end(done)
});

});

describe("DELETE /todos/:id", ()=>{
    it("should remove a todo", (done)=>{
var hexId =todos[1]._id.toHexString();
request(app)
.delete(`/todos/${hexId}`)
.set("x-auth", users[1].tokens[0].token)
.expect(200)
.expect((res)=>{
    expect(res.body.todo._id).toBe(hexId)
}).end((err, res)=>{
    if(err){
        return done(err);
    }
Todo.findById(hexId).then((todo)=>{
expect(todo).toBeFalsy();
done();
}).catch((err)=>done(err));


})
    });
    it("should remove a todo", (done)=>{
        var hexId =todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set("x-auth", users[1].tokens[0].token)
        .expect(404)
      .end((err, res)=>{
            if(err){
                return done(err);
            }
        Todo.findById(hexId).then((todo)=>{
        expect(todo).toBeTruthy();
        done();
        }).catch((err)=>done(err));
        
        
        })
            });
    it("should return 404 if todo not found", (done)=>{
        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .set("x-auth", users[1].tokens[0].token)
        .expect(404)
        .end(done)
        
    });
it("should return a 404 if object is invalid", (done)=>{
    request(app)
    .delete(`/todos/567`)
    .set("x-auth", users[1].tokens[0].token)
    .expect(404)
    .end(done)

});
});

describe("PATCH /todos/:id", ()=>{
it("should update my todo", (done)=>{
    var hexId=todos[0]._id.toHexString()
request(app)
.patch(`/todos/${hexId}`)
.set("x-auth", users[0].tokens[0].token)
.send({"text":"hello mottotto", completed:true})
.expect(200)
.expect((res)=>{
   expect(res.body.todo.text).toBe("hello mottotto")
    expect(res.body.todo.completed).toBe(true)
  expect(typeof res.body.todo.completedAt).toBe("number")
 
 })
.end((err, res)=>{
if(err){
    return done(err)
}
Todo.findById(hexId).then((todo)=>{
    expect(todo.text).toBe("hello mottotto")
    expect(todo.completed).toBe(true)
  expect(typeof todo.completedAt).toBe("number")
  done()
}).catch((e)=>{
    done(e)
})
})

})

it("should not update my todo created by another", (done)=>{
    var hexId=todos[0]._id.toHexString()
request(app)
.patch(`/todos/${hexId}`)
.set("x-auth", users[1].tokens[0].token)
.send({"text":"hello mottotto", completed:true})
.expect(404)
.end((err, res)=>{
if(err){
    return done(err)
}
Todo.findById(hexId).then((todo)=>{
    expect(todo.text).toBeTruthy();
    expect(todo.completed).toBe(false);
    console.log(todo.completedAt);
    
  expect(todo.completedAt).toBe(null);
  done()
}).catch((e)=>{
    done(e)
})
})

})

it("should clear completedAt when todo is not completed", (done)=>{
    var hexId=todos[1]._id.toHexString()
    request(app)
    .patch(`/todos/${hexId}`)
    .set("x-auth", users[1].tokens[0].token) 
.send({text:"hello motto2", completed:false})
.expect(200)
.expect((res)=>{
    expect(res.body.todo.text).toBe("hello motto2")
    expect(res.body.todo.completed).toBe(false)
    expect(res.body.todo.completedAt).toBeFalsy()
}).end((err, res)=>{
    if(err){
        return done(err)
    }
    Todo.findById(hexId).then((todo)=>{
        expect(todo.text).toBe("hello motto2")
        expect(todo.completed).toBe(false)
        expect(todo.completedAt).toBeFalsy()
      done()
    }).catch((err)=>{
        done(err)
    });
});
describe("GET /users/me", ()=>{
    it("should return user if authenticated", (done)=>{
        request(app)
        .get("/users/me")
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email)

        }).end(done);
    });
    it("should return a 401 if not authenticated", (done)=>{
        request(app)
        .get("/users/me")
        .set("x-auth", "")
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
          
        }).end(done)
    });
});

describe("POST /users", ()=>{
    it("should create a user", (done)=>{
       
       
        request(app)
        .post("/users")
        .send({email:"george1@gmail.com", password:"1234567"})
        .expect(200)
        .expect((res)=>{
            expect(res.body.email).toBe("george1@gmail.com")
            expect(res.headers["x-auth"]).toBeTruthy();
            expect(res.body._id).toBeTruthy();
        }).end(((err)=>{
            if(err){
                return done(err);
            }
            User.findOne({email: "george1@gmail.com"}).then((user)=>{
                expect(user).toBeTruthy();
                expect(user.password).not.toBe("1234567");
                done();
            }).catch((e)=>{
                done(e)
            })  
        }))
    });
    it("should return validation errors if request invalid", (done)=>{
        request(app)
        .post("/users")
        .send({email:"george1@gmail.com", password:"1234"})
        .expect(400)
        .expect((res)=>{
            expect(res.body).toEqual({})
           
        }).end(done)
    });
    it("should not create user if email in use", (done)=>{
        request(app)
        .post("/users")
        .send({email:"george@gmail.com", password:"1234567"})
        .expect(400)
        .expect((res)=>{
            expect(res.body).toEqual({})
           
        }).end(done)
    });
})

});
 });

 describe("POST /users/login", ()=>{
     it("should login user and return auth token", (done)=>{
        request(app)
        .post("/users/login")
        .send({
            email: users[1].email,
            password:users[1].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers["x-auth"]).toBeTruthy();
        })
        .end((err, res)=>{
            if(err){
                return done(err)
            }
        User.findById(users[1]._id).then((user)=>{
             
            expect(user.tokens[1]).toMatchObject({
                access:"auth",
                token: res.headers["x-auth"]
            })
            done();
        }).catch((e)=>{
            done(e)
        })    
        })
     })
     it("should reject invalid login", (done)=>{
        request(app)
        .post("/users/login")
        .send({
            email: users[1].email,
            password:"users[1].password"
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers).not.toHaveProperty("x-auth")
        })
        .end((err, res)=>{
            if(err){
                return done(err)
            }
        User.findById(users[1]._id).then((user)=>{
             
            expect(user.tokens.length).toBe(1)
            done();
        }).catch((e)=>{
            done(e)
        })    
        })
     })
 })
 describe("DELETE/users/me/token", ()=>{
  it("should remove auth token on logout", (done)=>{
      request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((err, res)=>{
        if(err){
            return done(err)
        }
          User.findById(users[0]._id).then((user)=>{
              console.log(user.tokens.length);
              
              expect(user.tokens.length).toBe(0)
              done()
          }).catch((e)=>{
              done(e)
          })
      })
  })   
 })