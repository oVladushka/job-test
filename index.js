const express = require('express');

const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

const hbs = require('hbs');

require('./models/User');
require('./models/Picture');
const Picture = mongoose.model('pictures');
const userRoutes = require('./routes/userRoutes');
const protect = require('./middlewares/protect');

dotenv.config({ path: './config.env'});

const app = express();
app.enable('trust proxy'); // для куки с токеном

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log('DB connection failed ', err);
        else console.log('DB connected successfully!')
    }
);

app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({}));
app.use(cookieParser());





// PAGES
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/upload', protect, (req, res) => {
    res.render('upload')
});

app.get('/last-post', protect, (req, res) => {
    res.render('last-post')
});

app.get(['/signup', '/signin'], (req, res) => {
    res.render('login', {
        isSignup: req.path === '/signup'
    })
});

app.get('/img/:id', protect, async (req, res) => {
    try{

        const picture = await Picture.findOne({_id: req.params.id});
        if(!picture) return res.status(400).json({error: 'No such picture'});

        const image = Buffer.from(picture.picture.buffer, 'base64');

        res.set('Content-Type', 'image/jpg');
        res.send(image)

    }catch(e){

        console.log(e);

        res.status(500).json({error: 'something went wrong, try again later'})

    }
});



//API
app.use('/api', userRoutes);

// NOT FOUND
app.all('*', (req, res) => {
    res.status(404).json({ error: 'Not found' })
});

// LITTLE ERR HANDLER
app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
});