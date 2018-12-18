'use strict';

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
            type: Date,
            default: Date.now()
        }
    });

// Definir model no bd
    mongoose.model('postagens', Postagem);