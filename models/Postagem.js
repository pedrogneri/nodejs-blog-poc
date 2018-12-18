'use strict';

var now = new Date;

// Require
    // Módulos
        const mongoose = require('mongoose');
        const Schema = mongoose.Schema;

// Model Postagem       
    const Postagem = new Schema({
        titulo: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        }, 
        descricao: {
            type: String,
            required: true
        },
        conteudo: {
            type: String,
            required: true
        },
        categoria: {
            type: Schema.Types.ObjectId,
            ref: 'categorias',
            required: true
        },
        data: {
            type: String,
            default: now.getDate() + "/" + (now.getMonth()+1) + "/" + now.getFullYear()
        }
    });

// Definir model no bd
    mongoose.model('postagens', Postagem);