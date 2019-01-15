const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

/* GET home page. */
router.get('/', (req, res, next) => {
    Class.getClasses((err, classes) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('index', { classes: classes });
        }
    }, 3);
});

module.exports = router;
