const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Class = require('../models/Class');
const Instructor = require('../models/Instructor');

router.get('/classes', (req, res) => {
    Instructor.getInstructorByUsername(req.user.username, (err, instructor) => {
        if (err) throw err;
        res.render('instructors/classes', { instructor });
    });
});

router.post('/classes/register', (req, res) => {
	const info = [];
	info['instructor_username'] = req.user.username;
	info['class_id'] = req.body.class_id;
	info['class_title'] = req.body.class_title;

	Instructor.register(info, function(err, instructor){
		if(err) throw err;
		console.log(instructor);
	});

	req.flash('success_msg', 'You are now registered to teach this class');
	res.redirect('/instructors/classes');
});

router.get('/classes/:id/lessons/new', (req, res) => {
    console.log(req.params.id);
	res.render('instructors/newlesson', { class_id: req.params.id });
});

router.post('/classes/:id/lessons/new', function(req, res){
	// Get Values
	const info = [];
	info['class_id'] = req.params.id;
	info['lesson_number'] = req.body.lesson_number;
	info['lesson_title'] = req.body.lesson_title;
	info['lesson_body'] = req.body.lesson_body;

	Class.addLesson(info, function(err){
        if (err) throw err;
		console.log('Lesson Added..');
	});

	req.flash('success_msg','Lesson Added');
	res.redirect('/instructors/classes');
});

module.exports = router;