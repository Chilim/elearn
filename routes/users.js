const express = require('express');
const router = express.Router();
const passport = require('passport');
const Strategy = require('passport-local').Strategy;


const User = require('../models/User');
const Student = require('../models/Student');
const Instructor= require('../models/Instructor');

/* Register User */
router.get('/register', (req, res) => res.render('users/register'));

router.post('/register', (req, res) => {
    console.log(req.body.type);
    const { 
        first_name, 
        last_name, 
        street_address, 
        city, 
        state, 
        zip, 
        email, 
        username, 
        password, 
        type
    } = req.body;
    req.checkBody('first_name', 'Необходимо добавить имя').notEmpty();
	req.checkBody('last_name', 'Необходимо добавить фамилию').notEmpty();
	req.checkBody('email', 'Необходимо добавить электронную почту').notEmpty();
	req.checkBody('email', 'Неправильный формат электронной почты').isEmail();
	req.checkBody('username', 'Необходимо добавить имя пользователя').notEmpty();
	req.checkBody('password', 'Необходимо добавить пароль').notEmpty();
    req.checkBody('password2', 'Пароль не совпадает').equals(password);
    
    const errors = req.validationErrors();
    if (errors) {
        res.render('users/register', { errors });
    } else {
		const newUser = new User({
			email,
			username,
			password,
			type
        });
        if (type === 'student') {
            const newStudent = new Student({
				first_name,
				last_name,
				address: [{
					street_address,
					city,
					state,
					zip
				}],
				email,
				username
            });
            console.log('a student');
            User.saveStudent(newUser, newStudent, () => console.log('Student created'));

        } else {
            const newInstructor = new Instructor({
				first_name,
				last_name,
				address: [{
					street_address,
					city,
					state,
					zip
				}],
				email,
				username
            });
            console.log('this is an instructor');
			User.saveInstructor(newUser, newInstructor, () => console.log('Instructor created'));
        }
        req.flash('success_msg', 'Учетная запись создана');
		res.redirect('/');
    }
});

passport.serializeUser((user, done) =>	done(null, user._id));
  
passport.deserializeUser((id, done) => {
	User.getUserById(id, (err, user) => {
		done(err, user);
	});
});

router.post('/login', 
	passport.authenticate('local', { 
		failureRedirect: '/', 
		badRequestMessage : 'Пожалуйста, введите данные учетной записи', 
		failureFlash: true 
	}), 
	(req, res) => {
		// console.log(req.user.username);
		req.flash('success_msg', 'Вы вошли в систему');
		res.redirect(`/${req.user.type}s/classes`);
});


passport.use(new Strategy(
	(username, password, done) => {
		User.getUserByUsername(username, (err, user) => {
			// console.log(username);
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: `Пользователь ${username} не зарегистрирован`});
			}
			User.comparePassword(password, user.password, (err, isMatch) => {
				return err ? done(err) : isMatch ? done(null, user) : 
					done(null, false, { message: 'Неверный пароль' });
			});
		});
	})
);


// Log User Out
router.get('/logout', function(req, res){
	req.logout();
	// Success Message
	req.flash('success_msg', 'Вы вышли');
	res.redirect('/');
});



module.exports = router;
