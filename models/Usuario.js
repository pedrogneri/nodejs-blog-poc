'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ehAdmin: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        required: true
    }
}); 

mongoose.model('usuarios', Usuario);