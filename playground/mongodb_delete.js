//const MongoClient =require("mongodb").MongoClient;
const {MongoClient, ObjectID} =require("mongodb") 

    var obj = new ObjectID();
    console.log(obj);


  
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client)=>{
if(err){
   return console.log('Unable to connect to MongoDB server');
    
}
console.log('Connected to MongoDB server');

//deleteMany
 const db = client.db("TodoApp")
// db.collection("Todos").deleteMany({text:"eat lunch"}).then((result)=>{
//     console.log(result);
    
// })
//deleteOne
// db.collection("Todos").deleteOne({text:"eat lunch"}).then((result)=>{
//     console.log(result);
    
// })
//findOneAndDelete
// db.collection("Todos").findOneAndDelete({completed:false}).then((result)=>{
//     console.log(result);
    
// })
// db.collection("Users").deleteMany({name:"George"}).then((result)=>{
//     console.log(result);
    
// })
db.collection("Users").findOneAndDelete({_id:new ObjectID("5aec7faa67c736077d3d2493")}).then((result)=>{
console.log(result);

})

//client.close()//closes connection with server
});