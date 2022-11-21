const express = require('express');
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser= require('../Middlewares/fetchuser');

const router = express.Router();

//this is salt added to token
const JWT_SECRET = "thisissecret ";

//Route1: Create a user at /api/auth/createUser   no login required here        // express validator
router.post('/createUser',
    [body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password length should be greater than 5 characters').isLength({ min: 5 })],
    async (req, res) => {
        let success = false;
        // if error occurs return status and error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // success = false;
            return res.status(400).json({ errors: errors.array() });
        }
        // try to valdidate and catch error
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "This email address already exists" })
            }
            var salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })
            const data = { user: { id: user.id } }
            var authtoken = jwt.sign(data, JWT_SECRET)
            // success = true;
            // res.json({ authtoken })
            // res.json(user)
            success=true;
            res.send({success, authtoken })

        } catch (error) {
            console.log(error.message)
            res.status(500).send("Some internal server error occurerd")
        }
        // .then(user => res.json(user))
        // .catch(err=> {console.log(err)
        //     res.json({error:'Please Enter unique value of email',message:err.message})})


    })

//Route 2: Login a user at /api/auth/login   no login required here        // express validator

router.post('/login',
    [body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()],
    async (req, res) => {
        let success = false;
        // if error occurs return status and error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // success = false
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // try to valdidate and catch error
        try {
            let user = await User.findOne({ email });
            if (!user) {
                success = false;
                return res.status(400).json({ success, error: "Please enter correct credentials" });
            }

            let passwordcompare = await bcrypt.compare(password, user.password);
            if (!passwordcompare) {
                return res.status(400).json({ success,errors: "Please try to login with correct credentials" });
            };
            const data = { user: { id: user.id } }
            var authtoken = jwt.sign(data, JWT_SECRET)
            success = true;
            res.json({ success ,authtoken})
        } catch (error) {
            console.error(error.message)
            res.status(500).send("Some internal server error occurerd")
        }

    })


//Route3: Accessing user data /api/auth/getUser   login required here       

router.post('/getUser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        // check whether user with this email  exist
        let user = await User.findById({userId}).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some internal server error occurerd")
    }

})

module.exports = router