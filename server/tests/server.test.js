const expect = require("expect");
const request = require("supertest")
const {app} =require("./../server");
const {Todo}=require("./../models/todo")
const {ObjectID} = require("mongodb")
//testing life cycle method

const todos = [{
    _id: new ObjectID(),
    text:"First test"
},{
    _id: new ObjectID(),
    text:"second test",
    completed:true,
    completedAt:333
}]

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
      return  Todo.insertMany(todos)
    }).then(()=>done())
})
describe("POST /todos", ()=>{
    it("should create a new todo", (done)=>{
        var text = "test todo text";

        request(app)
        .post("/todos")
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
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2)
        })
        .end(done);
    })
})
describe("GET /todos/ :id", ()=>{
    it("should get todo by id", (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text)
        }).end(done);
    })
it("should return 404 if todo not found", (done)=>{
request(app)
.get(`/todos/${new ObjectID().toHexString()}`)
.expect(404)
.end(done)
});
it("should return 404 if todo id not valid", (done)=>{
    request(app)
    .get("/todos/123")
    .expect(404)
    .end(done)
});

});

describe("DELETE /todos/:id", ()=>{
    it("should remove a todo", (done)=>{
var hexId =todos[1]._id.toHexString();
request(app)
.delete(`/todos/${hexId}`)
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
    it("should return 404 if todo not found", (done)=>{
        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done)
        
    });
it("should return a 404 if object is invalid", (done)=>{
    request(app)
    .delete(`/todos/567`)
    .expect(404)
    .end(done)

});
});

describe("PATCH /todos/:id", ()=>{
it("should update my todo", (done)=>{
    var hexId=todos[0]._id.toHexString()
request(app)
.patch(`/todos/${hexId}`)
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
it("should clear completedAt when todo is not completed", (done)=>{
    var hexId=todos[1]._id.toHexString()
    request(app)
    .patch(`/todos/${hexId}`)
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
    })
})
});
 })