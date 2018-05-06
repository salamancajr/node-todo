const {ObjectID} =require("mongodb")

const {mongoose}=require("./../server/db/mongoose");
const {Todo}=require("./../server/models/todo")
const {User}=require("./../server/models/user")

// Todo.remove({}).then((result)=>{
//     console.log(result);
    
// });

//Todo.findOneAndRemove
//Todo.findByIdAndRemove
Todo.findByIdAndRemove("5aee589659710be4747185a1").then((todo)=>{
    console.log(todo);
    
})