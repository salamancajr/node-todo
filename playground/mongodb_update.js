//const MongoClient =require("mongodb").MongoClient;
const {MongoClient, ObjectID} =require("mongodb") 

    var obj = new ObjectID();
    console.log(obj);


  
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client)=>{
if(err){
   return console.log('Unable to connect to MongoDB server');
    
}
console.log('Connected to MongoDB server');

 
 const db = client.db("TodoApp")
// db.collection("Todos").findOneAndUpdate({
//     _id: new ObjectID("5aec94b48645b47bf86c6ce0")
// }, {
//     $set:{
//      completed:true   
//     }
// },{
//         returnOriginal:false
    
// }).then((result)=>{
//     console.log(result);

// })

// db.collection("Users").findOneAndUpdate({
//     name:"Jenn"
// }, {
//     $set:{
//         name: "George"
//     }
// }, {
//     returnOriginal:false
// }).then((result)=>{
//     console.log(result);
    
// })
db.collection("Users").findOneAndUpdate({
    name:"George"
},
{
    $inc:{age:2}
}, {returnOriginal:false}).then((result)=>{
    console.log(result);
    
})


//client.close()//closes connection with server
});