const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userModel = require('./model');
const middleware = require('./middleware.js')
const app = express();
mongoose.connect('mongodb+srv://KiranLammidi:KiranLammidi@ayyagaru.btnjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    () => { console.log('DB connected') }
)
app.use(express.json());
app.use(cors({
    origin: '*'
}))
app.get('/', async (req, res) => {
    res.send('Successful');
})
app.get('/hadavidi', async (req, res) => {
    res.send('Welcome to hadavidi');
    res.status(200);
})
app.post('/register', async (req, res) => {
    try {
        const { fullname, email, mobile, skills, password, confirmPass } = req.body;
        const xist = await userModel.findOne({ email });
        if (xist) {
            return res.status(400).send('User already found');
        }
        if (password != confirmPass) {
            return res.status(403).send('Passwords not matched');
        }
        let newUser = new userModel({
            fullname,
            email,
            mobile,
            skills,
            password,
            confirmPass
        });
        newUser.save().then(res.status(200).send('User registered'))
    } catch (error) {
        console.log(error);
        res.status(505).send(error);




    }
})

app.get('/login', async (req, res) => {

    const { email, password } = req.body;

    let exists = await userModel.findOne({ email });
    if (!exists) {
        res.status(300).send('user not found');

    }
    if (exists.password != password) {
        res.status(300).send('password invalid');

    }
    let payload = {
        user: {
            id: exists.id,
        }
    }


    jwt.sign(payload, 'jwtPass', { expiresIn: 360000000 },
        (err, token) => {
            if (err) throw (err);
            return res.json({ token })
        })
})

app.get('/allprofiles', middleware, async (req, res) => {
    try {
        let profs = await userModel.find()
        res.json(profs)


    } catch (err) {
        console.log(err)
        res.status(500).send('server issue')

    }
})
app.get('/myprofile', middleware, async (req, res) => {
    let user = await userModel.findById(req.user.id);
    return res.json(user)
})

app.listen(5000, () => console.log('Server running...'));


// http.createServer((req, res) => {
//     // res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('hello lammidi\n');
// }).listen(6969);
// console.log("balaram pumka");
// console.error('balaram pumka');
// console.warn('balaram pumka');

// const events = require('events');
// var eventEmitter = new events.EventEmitter();

// var zeba = function zeba() {
//     console.log('balaram lammidi');
// }
// eventEmitter.on('balram', zeba);
// eventEmitter.emit('balram')