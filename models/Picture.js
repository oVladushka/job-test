const mongoose = require('mongoose');
const {Schema} = mongoose;

const Picture = new Schema({
    picture: {
        type: Buffer
    },
    master: mongoose.Schema.ObjectId,

}, {
    timestamps: true
});



mongoose.model('pictures', Picture);