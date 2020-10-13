const mongoose = require('mongoose');
const validator = require('validator');
const format = require('date-format');

const Picture = mongoose.model('pictures');
const User = mongoose.model('users');

function sendCookie(req, res, cookie_name, token) {
    if(req.secure || process.env.NODE_ENV === 'production'){
        res.cookie(cookie_name, token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // через n дней истечёт
            httpOnly: true,
            secure: true
            // domain: 'my-site.com',
            // path: '/api'
        });
    }else{
        res.cookie(cookie_name, token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // через n дней истечёт
            httpOnly: true,
            secure: false
            // domain: 'my-site.com',
            // path: '/api'
        });
    }
}

exports.signup = async (req, res) => { // регистрация
    try{

        const {password, email, name} = req.body;

        const user = new User({name, email, password});

        await user.save();

        const token = await user.generateAuthToken();

        sendCookie(req, res, 'jwt', token);

        res.status(200).json({message: 'success', token});


    }catch(e){

        if(e.errors.name || e.errors.email || e.errors.password){
            const emailErr = /\b(unique)\b/gm.test(e.errors.email.message) ? 'such email already exists' : e.errors.email.message;

            const errors = {
                name: e.errors.name ? e.errors.name.message : 'ok',
                email: e.errors.email ? emailErr : 'ok',
                password: e.errors.password ? e.errors.password.message : 'ok'
            };

            res.status(400).json({ error: errors });
        }else{
            res.status(400).json({ error: 'something went wrong, try again later' });
        }
    }
};
exports.signin = async (req, res) => {
    try{

        const {password, email} = req.body;
        if(!password || !email) return res.status(400).json({error: 'password or email is invalid'});

        let user = await User.findOne({email});
        if(!user || !(await user.correctPassword(password, user.password))) return res.status(400).json({error: 'password or email is invalid'});

        const token = await user.generateAuthToken();

        sendCookie(req, res, 'jwt', token);

        res.status(200).json({message: 'success', token});

    }catch(e){

        res.status(500).json({error: 'something went wrong, try again later'})

    }
};

// IMAGES
exports.uploadImage = async (req, res) => {
    try{

        const picture = new Picture({picture: req.file.buffer, master: req.user.id});

        await picture.save();

        res.status(200).json({ message: 'success', id: picture.id  })
    }catch(e){

        console.log(e);

        res.status(500).json({error: 'something went wrong, try again later'})

    }
};
exports.getLastPosts = async (req, res) => {
    try{

        const picture = await Picture.find({master: {$eq: req.user.id}}).sort({$natural: -1}).limit(10);
        if(!picture) return res.status(400).json({error: 'No such picture'});

        const dataToSend = picture.map((item) => {
            return {
                id: item._id,
                date: format.asString('dd.MM.yy hh:mm', item.createdAt)
            }
        });

        res.status(200).json({message: 'success', data: dataToSend})
    }catch(e){

        console.log(e);

        res.status(500).json({error: 'something went wrong, try again later'})

    }
};
exports.getImage = async (req, res) => {
    try{

        const picture = await Picture.findOne({_id: req.params.id});
        if(!picture) return res.status(400).json({error: 'No such picture'});

        res.set('content-type', 'image/png');
        res.status(200).send(picture.picture.buffer)

    }catch(e){

        console.log(e);

        res.status(500).json({error: 'something went wrong, try again later'})

    }
};