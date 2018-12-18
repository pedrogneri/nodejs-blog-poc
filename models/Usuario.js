'use strict';

// Require
    // Módulos
        const mongoose = require('mongoose');
        const Schema = mongoose.Schema;

// Model Postagem     
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

// Definir model no bd
    mongoose.model('usuarios', Usuario);