const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken")
const _ = require("lodash")
var Schema = mongoose.Schema;
var UserSchema = new Schema({
 
    email:{
        type:"string",
        required:true,
        minlength:1,
        trim:true, 
        unique:true, //verifies that the propery does not have same value as any other instance in the collection
        validate:{
            validator: validator.isEmail,
       message:"{VALUE} is not a valid email"
        }
    }, 
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{
        access:{
            type: String,
            required:true
        },
        token:{
            type: String,
            required:true    
        }
    }]
});

UserSchema.methods.toJSON =function() {
var user = this;
var userObject = user.toObject();
return _.pick(userObject, ["_id", "email"])
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id:user._id.toHexString(), access}, "abc123")
    
    user.tokens = user.tokens.concat({access, token});

   return user.save().then(()=>{
        return token;
    })
 
};

var User = mongoose.model("User", UserSchema)

module.exports ={User}