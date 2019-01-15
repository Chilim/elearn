const mongoose = require('mongoose');


const Schema = mongoose.Schema; 


// Class Schema
const ClassSchema = new Schema({
	title: { type: String },
	description: { type: String },
	instructor:{ type:String},
	lessons:[{
		lesson_number: {type: Number},
		lesson_title: {type: String},
		lesson_body:{type: String}
	}]
});

const Class = module.exports = mongoose.model('Class', ClassSchema);

// Fetch All Classes
module.exports.getClasses = function(callback, limit){
	Class.find(callback).limit(limit);
};

// Fetch Single Class
module.exports.getClassById = function(id, callback){
	Class.findById(id, callback);
};

// Add Lesson
module.exports.addLesson = function(info, callback) {
	const class_id = info['class_id'];
	const lesson_number = info['lesson_number'];
	const lesson_title = info['lesson_title'];
	const lesson_body = info['lesson_body'];

	Class.findByIdAndUpdate(
		class_id,
		{ $push:{ 'lessons':{ lesson_number: lesson_number, lesson_title: lesson_title,lesson_body:lesson_body } } },
		{ safe: true, upsert: true },
		callback
		);
};