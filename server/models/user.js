/**
 * Created by Tim on 9/25/2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//define user model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

// on save hook, encrypt password
userSchema.pre('save', function(next){
    const user = this;

    //generates a salt, uses callback
    bcrypt.genSalt(10, function(err, salt){
        if(err) { return next(err);}

        // hash password using salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {return next(err);}

            // overwrite plain text password with encrypted pw
            user.password = hash;
            // finishes saving model
            next();
        })
    })
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err){return callback(err);}
        callback(null, isMatch);
    })
}
//Create model class
const ModelClass = mongoose.model('user', userSchema);

//Export model
module.exports = ModelClass;