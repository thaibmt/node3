const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    title: String,
    price: {
        type: String,
        default: 0
    },
    description: String,
});

const Phone = mongoose.model('Phone', phoneSchema);

module.exports = Phone;
