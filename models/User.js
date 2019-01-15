const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const async = require('async');


const UserSchema = mongoose.Schema({
	username: { type: String },
	email: { type: String },
	password:{ type: String, bcrypt: true },
	type:{ type: String }
});

const User = module.exports = mongoose.model('User', UserSchema);

// Get User by Id
// module.exports.getUserById = (id, callback) =>	User.findById(id, callback);
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// Get User by Username
// module.exports.getUserByUsername = (username, callback) => User.findOne({ username }, callback);
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
};


// Compare password
module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
};


// Create Student User
module.exports.saveStudent = (newUser, newStudent, callback) => {
	bcrypt.hash(newUser.password, 10, function(err, hash) {
		if(err) throw err;
		// Set hash
		newUser.password = hash;
		console.log('Student is being saved');
		async.parallel([newUser.save.bind(newUser), newStudent.save.bind(newStudent)], callback);
	});
};

// Create Instructor User
module.exports.saveInstructor = (newUser, newInstructor, callback) => {
	bcrypt.hash(newUser.password, 10, function(err, hash) {
		if(err) throw err;
		// Set hash
		newUser.password = hash;
		console.log('Instructor is being saved');
		async.parallel([newUser.save.bind(newUser), newInstructor.save.bind(newInstructor)], callback);
	});
};