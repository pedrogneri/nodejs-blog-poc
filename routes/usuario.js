'use strict';

// Require
    // Modulos
        const express = require('express');
        const router = express.Router();
        const mongoose = require('mongoose');
        const bcrypt = require('bcryptjs');
        const passport = require('passport');
    // Model
        require('../models/Usuario');
        const Usuario = mongoose.model('usuarios');

// erros
    const erroInterno = 'Houve um erro interno';

// Rotas

    // Registro
        router.get('/registro', (req, res) => {
            if(req.isAuthenticated()){
                res.redirect('/');
            } else {
                res.render('usuarios/registro');
            }
        });

        router.post('/registro', (req, res) => {
            var erros = [];

            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({
                    texto: 'Nome inválido'
                });
            }
            if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
                erros.push({
                    texto: 'Email inválido'
                });
            }
            if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
                erros.push({
                    texto: 'Senha inválida'
                });
            }
            if(req.body.senha.length < 4){
                erros.push({
                    texto: 'Senha muito curta'
                });
            }
            if(req.body.senha != req.body.senha2){
                erros.push({
                    texto: 'As senhas são diferentes'
                });
            }

            if(erros.length > 0){
                res.render('usuarios/registro', {
                    erros: erros
                });
            }else {
                Usuario.findOne({
                    email: req.body.email
                }).then((usuario) => {
                    if(usuario){
                        req.flash('error_msg', 'Já existe uma conta com esse email cadastrado');
                        res.redirect('/usuarios/registro');
                    } else {
                        const novoUsuario = new Usuario({
                            nome: req.body.nome,
                            email: req.body.email,
                            senha: req.body.senha
                        });

                        bcrypt.genSalt(10, (erro, salt) => {
                            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                                if(erro){
                                    req.flash('error_msg', 'Houve um erro durante o salvamento do usuário');
                                    res.redirect('/usuarios/registro');
                                } else {
                                    novoUsuario.senha = hash;

                                    novoUsuario.save().then(() => {
                                        req.flash('success_msg', 'Usuário registrado com sucesso');
                                        res.redirect('/');
                                    }).catch((err) => {
                                        req.flash('error_msg', 'Houve um erro ao registrar o usuário');
                                        res.redirect('/usuarios/registro');
                                    });
                                }
                            });
                        });
                    }
                }).catch((err) => {
                    req.flash('error_msg', erroInterno);
                    res.redirect('/registro');
                });
            }
        });


    // Login


        router.get('/login', (req, res) => {
            if(req.isAuthenticated()){
                res.redirect('/');
            } else{
                res.render('usuarios/login');
            } 
        });

        router.post('/login', (req, res, next) => {
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/usuarios/login',
                failureFlash: true
            })(req, res, next)
        });


    // Logout


        router.get('/logout', (req, res) => {
            if(req.isAuthenticated()){
                req.logout();
                req.flash('success_msg', 'Deslogado com sucesso');
            } 
            res.redirect('/');
        });

// Exportar rotas     
    module.exports = router; 