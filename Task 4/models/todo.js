const mongoose = require('mongoose');
//const u=require('./user');
//import { muser } from './user';
const uerR = require('./user');

const Todoschema = new mongoose.Schema({

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: uerR,
    },

    title: {
        type: String,
        maxlength: 20,
        minlength: 10,
    },
    body: {
        type: String,
        maxlength: 500,
        minlength: 10,

    },
    tags: {
        type: String,
        maxlength: 10,
        enum: ["tags1", "tag2", "tag3"],

    },

    //createdAt: Date.now,
    //updatedAt: Date.now

});

const todo = mongoose.model('todo', Todoschema);
module.exports = todo;

//export const todo = Todoschema.discriminator('todo', muser);