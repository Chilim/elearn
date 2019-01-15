const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Student = require('../models/Student');

router.get('/classes', (req, res) => {
    console.log(req.user.username);
    Student.getStudentByUsername(req.user.username, (err, student) => {
        
        if (err) throw err;
        res.render('students/classes', { student });
    });
});


module.exports = router;