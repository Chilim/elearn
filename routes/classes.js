const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

/* GET classes page. */
router.get('/', (req, res) => {
    Class.getClasses((err, classes) => {
        if (err) {
            return console.log(err);
        }
        res.render('classes/index', { classes });
    }, 3);
});

/* GET class details page. */

router.get('/:id/details', (req, res) => {
    Class.getClassById([req.params.id], (err, classname) => {
        if (err) {
            return console.log(err);
        }
        res.render('classes/details', { class: classname });
    });
});

/* GET lessons page. */

router.get('/:id/lessons', (req, res) => {
    Class.getClassById([req.params.id], (err, classname) => {
        if (err) {
            return console.log(err);
        }
        res.render('classes/lessons', { class: classname });
    });
});

// Get lesson details
router.get('/:id/lessons/:lesson_id', (req, res) => {
	Class.getClassById([req.params.id], (err, classname) => {
		let lesson;
        if(err) throw err;
        // classname.lessons.forEach(item => 
        //     item.lesson_number === req.params.lesson_id ? 
        //         lesson = item : null);
		for(let i=0; i<classname.lessons.length; i++){
			if(classname.lessons[i].lesson_number == req.params.lesson_id){
				lesson = classname.lessons[i];
			}
		}
		res.render('classes/lesson', { class: classname, lesson });
	});
});


module.exports = router;
