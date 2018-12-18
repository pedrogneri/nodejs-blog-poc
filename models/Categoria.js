'use strict';

var now = new Date;

// Require
    // Módulos
        const mongoose = require('mongoose');
        const Schema = mongoose.Schema;

// Model Categoria
    const Categoria = new Schema({
        nome: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        date: {
            type: String,
            default: now.getDate() + "/" + (now.getMonth()+1) + "/" + now.getFullYear()
        }
    });

// Definir model no bd
    mongoose.model('categorias', Categoria);