const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { route } = require('.');

// Login Page
router.get('/login', (req, res)=>{
    res.render("login");
});

// Register Page
router.get('/register', (req, res)=>{
    res.render("register");
});

router.post('/register', (req, res)=>{
    const { name, email, password1, password2 } = req.body;
    console.log(req);
    
    let errors = [];
    // Check required fields.
    if (!name || !email || !password1 || !password2){
        errors.push({msg: 'Please fill in all the fields.'});
    }

    // Check password match
    if (password1 != password2){
        errors.push({msg: 'Password do not match'});
    }
    // Check password length
    // if (password1.length < 6){
    //     errors.push({msg: 'Entered password should have length more than six.'});
    // }
    if (errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password1,
            password2
        });
    }else{
        //Induce model - User here.
        const User = require('../models/User');
        
        User.findOne({email: email})
        .then((user)=>{
            if (user){
                //User Exists.
                errors.push({msg: 'Email already exists. Use different email id.'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password1,
                    password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password: password1
                });
            //HashPassword.
            bcrypt.genSalt(10, (err, salt)=>bcrypt.hash(newUser.password, salt, (error, hash)=>{
                if (error) throw err;

                newUser.password = hash;

                newUser.save()
                .then((user)=> {
                    req.flash('success_msg', 'You are successfully registered. Please login with credentials.');
                    res.redirect('login')})
                .catch(console.log(err))
            }))
            }
        })
    }
});

// Login handle
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
})

// Lougout handler
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are successfully logged out.');
    res.redirect('login');
});

module.exports = router;