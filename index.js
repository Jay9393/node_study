const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

const config = require('./config/key')

const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World==========='))

app.post('/register', (req, res) => {
    const user = new User(req.body)
    user.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "Couldn’t find a account associated with this email. Please try again."
            })
        }

        user.comparePassword(req.body.password , (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "That’s not the right password." })

        })
    })

})

app.listen(port, () => console.log('example app listening on port ${port}!'))
