const mongoose = require('mongoose');
const schema = new mongoose.Schema({

    usrename: {
        type: String,
        required: [true, 'you must enter user name'],
        unique: true

        // enum:['in-prog']
    },
    password: {
        type: String,
        required: [true, 'you must enter password '],

        // maxlength:20
    },
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 15,

    },
    age: {
        type: Number,
        min: 13,
        enum: [21, 20, 15, 17, 18, 19, 25],


    }


});

const user = mongoose.model('user', schema);
module.exports = user;