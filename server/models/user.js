var mongoose = require("mongoose")

var User = mongoose.model("User",{
    user:{
        type:"string",
        required:true,
        minlength:1,
        trim:true
    },
    email:{
        type:"string",
        required:true,
        minlength:1,
        trim:true}
})

module.eexports ={User}