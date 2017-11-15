var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;
const connection = mongoose.connect('mongodb://localhost/passport',(err)=>{
});

// define the schema for our user model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  id: String,
  password:String
})

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password,hash) {
    return bcrypt.compareSync(password,hash);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);