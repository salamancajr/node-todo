//const MongoClient =require("mongodb").MongoClient;
const {MongoClient, ObjectID} =require("mongodb") 

    var obj = new ObjectID();
    console.log(obj);


var user = 
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client)=>{
if(err){
   return console.log('Unable to connect to MongoDB server');
    
}
console.log('Connected to MongoDB server');
const db = client.db("TodoApp")
// db.collection("Todos").insertOne({
//     text:"somthing to do",
//     completed:false
// }, (err, result)=>{
// if (err){
//     return console.log('Unable to insert todo');
    
// }
// console.log(JSON.stringify(result.ops, undefined, 2));

// })

//insert new doc into Users collection with {name, age, location}
//const db = client.db("UsersApp")
// db.collection("Users").insertOne({
//     name:"George",
//     age:"32",
//     location:"NYC"
// }, (err, result)=>{
// if(err){
//    return console.log('Unable to create user', err);
    
// }
// console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));

// })

client.close()//closes connection with server
});