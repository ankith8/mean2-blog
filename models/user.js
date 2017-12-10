const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if(!email) {
        return false;
    } else {
        if(email.length < 5 || email.length > 30) {
            return false;
        }
        return true;
    }
}

let validEmailChecker = (email) => {
    if(!email) {
        return false;
    } else { 
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

const emailValidators = [{
    validator: emailLengthChecker,
    message: 'E-mail length must be atleast 5 characters but no more than 30'
},
{
    validator: validEmailChecker,
    message: 'Must be a valid e-mail.'
}];

let userNameLengthChecker = (username) => {
    if(!username) {
        return false;
    } else {
        if(username.length < 3 || username > 15) {
            return false;
        }
        return true;
    }
};

let validUsername = (username) => {
    if(!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}

const userNameValidators = [{
    validator: userNameLengthChecker,
    message: 'UserName must be atleast 3 characters but no more than 15'
},
{
    validator: validUsername,
    message: 'Must not have any spectal characters'
}]; 

let passwordLengthChecker = (password) => {
    if(!password) {
        return false;
    } else { 
        if(password.length < 8 || password > 35){
            return false;
        }
        return true;
    }
}

let validPassword = (password) => {
    if(!password) {
        return false;
    } else { 
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return RegExp.test(password);
    }
}

const passwordValidators = [{
    validator: passwordLengthChecker,
    message: 'Password must be atleast 8 characters but no more than 35'
},
{
    validator: validPassword,
    message: 'Must have atleast one uppercase, lowercase, special character and number '
}]; 

const userSchema = new Schema({
    email: { type: String, required:true, unique:true, lowercase: true ,validate: emailValidators },
    username: { type: String, required:true, unique:true, lowercase:true , validate: userNameValidators },
    password: { type: String, required:true, validate: passwordValidators }
}); 

userSchema.pre('save', function(next){
    if(!this.isModified('password')){
        return next();
    }

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User', userSchema);