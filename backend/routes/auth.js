const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = 'Thisisa$ecret';

//ROUTE-1: create a user using : POST "api/auth/createuser". No login required

router.post('/createuser', [
    body('name', "Enter a valid Name of minimum length i.e. 3 characters!").isLength({ min: 3 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Enter a Strong password!").isLength({ min: 6 }),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad requests and the errors.
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({success, errors: result.array() });
    }

    // Check whether the user with this email already exists
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email is already exists!" })
        }

        const salt = await bcrypt.genSalt(10);
        const SecPass = await bcrypt.hash(req.body.password, salt);
        // Create a new User
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: SecPass,
        });
        // .then(user => res.json(user))
        // .catch(err => {console.log(err)
        // res.json({error: 'Please enter a Unique Email', message:err.message})})

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        // console.log(user.id);

        // res.json(user);
        success = true; 
        res.json({success, authToken });

        // res.send(req.body);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
})

//ROUTE-2 : Authenticate a user using : POST "api/auth/login". No login Required
router.post('/login', [
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Must fill the password").exists(),

], async (req, res) => {

    let success = false
    // If there are errors, return Bad requests and the errors.
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;
    try {
        // store the user info in (const user) by finding that the entered email is present or not
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({success, error: "Please try to login with correct credentials" });
        }

        // Comparing entered password with the hash of the correct password which is already present in DB
        const password_Comp = await bcrypt.compare(password, user.password);

        if (!password_Comp) {
            success = false
            return res.status(400).json({success, error: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server occured");
    }
});

//ROUTE-3 : Get loggedIn user details : POST "api/auth/details".Login Required
router.post('/details', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.json(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server occured");
    }
});

module.exports = router
