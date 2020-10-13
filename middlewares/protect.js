const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const mongoose = require('mongoose');
const validator = require('validator');
const User = mongoose.model('users');

module.exports = protect = async (req, res, next) => {
    try{

        // ПРОВЕРЯЕМ КУКУ С ТОКЕНОМ
        if(!req.cookies.jwt // если нет токена
            ||
            !validator.isJWT(req.cookies.jwt) // если в куки не JWT token
        ) {
            return res.status(401).redirect('/signin')
        }

        // ВЕРИФИЦИРУЕМ ТОКЕН (был ли он изменён или истек срок)
        const token = req.cookies.jwt;
        const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);

        // ПРОВЕРЯЕМ ЕСТЬ ЛИ ПОЛЬЗОВАТЕЛЬ С ТАКИМ АЙДИ
        const user = await User.findOne({_id: decoded._id});
        if(!user) return res.status(401).redirect('/signin');

        req.user = user;
        next();
    }catch(e){
        if(e.name === 'JsonWebTokenError') { e.message = 'Invalid token. Please, log in again'; return res.status(401).redirect('/signin') }
        if(e.name === 'TokenExpiredError') { e.message = 'Token is expired. Please, log in again'; return res.status(403).redirect('/signin'); }
        res.status(500).json({error: 'something went wrong, try again later'})
    }
};