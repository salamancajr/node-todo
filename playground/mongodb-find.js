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

// db.collection("Todos").find({
//     _id:new ObjectID("5aec84648645b47bf86c6956")
// }).toArray().then((docs)=>{
// console.log('"Todos');
// console.log(JSON.stringify(docs, undefined, 2));



// }, (err)=>{console.log('Unable to fetch todos', err);
// })

// //client.close()//closes connection with server
// });

// db.collection("Todos").find().count().then((count)=>{
// console.log(`Todos count: ${count}`);
 



// }, (err)=>{console.log('Unable to fetch todos', err);
// })

db.collection("Users").find({name:"George"}).toArray().then((docs)=>{
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
    
    
}, (err)=>{
    console.log('Unable to fetch Users', err);
    
})



//client.close()//closes connection with server
});