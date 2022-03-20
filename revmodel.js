var mongoose = require('mongoose');

const revmodel = new mongoose.Schema({
    taskworker: {
        type: String,
        required: true
    },
    taskprovider: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('revmodel',revmodel);