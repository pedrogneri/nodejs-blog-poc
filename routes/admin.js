'use strict';

// Require 
    // módulos
        const express = require('express');
        const router = express.Router();
    // Model
        const mongoose = require('mongoose');
        require('../models/Categoria');
        const Categoria = mongoose.model('categorias');
        require('../models/Postagem');
        const Postagem = mongoose.model('postagens');
    // Helpers
        const {ehAdmin} = require('../helpers/ehAdmin');

// erros
    const erroInterno = 'Houve um erro interno';

// Rotas

    // Categorias
        

        // Read


        router.get('/categorias', ehAdmin, (req, res) => {
            Categoria.find().then((categorias) => {
                res.render('admin/categorias', {
                    categorias: categorias
                });
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao listar as categorias');
                res.redirect('/admin');
            });
        });


        // Create


        router.get('/categorias/add', ehAdmin, (req, res) => {
            res.render('admin/addcategorias')
        });

        router.post('/categorias/nova', ehAdmin, (req, res) => {
            var erros = [];

            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({
                    texto: 'Nome inválido'
                });
            }
            if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
                erros.push({
                    texto: 'Slug inválido'
                });
            }

            if(erros.length > 0){
                res.render('admin/addcategorias', {
                    erros: erros
                });
            } else {
                cadastrarCategoria();
            }

            function cadastrarCategoria(){
                const novaCategoria = {
                    nome: req.body.nome,
                    slug: req.body.slug
                }
            
                new Categoria(novaCategoria).save().then(() => {
                    req.flash('success_msg', 'Categoria criada com sucesso!');
                    res.redirect('/admin/categorias/');
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente!');
                    res.redirect('/admin');
                });
            }
        });


        // Update


        router.get('/categorias/edit/:id', ehAdmin, (req, res) => {
            Categoria.findOne({
                _id: req.params.id
            }).then((categoria) => {
                res.render('admin/editcategorias', {
                    categoria: categoria
                });
            }).catch((err) => {
                req.flash('error_msg', 'Esta categoria não existe');
                res.redirect('/admin/categorias');
            });
        });

        router.post('/categorias/edit', ehAdmin, (req, res) => {
            var erros = [];

            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({
                    texto: 'Nome inválido'
                });
            }
            if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
                erros.push({
                    texto: 'Slug inválido'
                });
            }

            if(erros.length > 0){
                res.render('admin/editcategorias', {
                    erros: erros
                });
            } else {
                editarCategoria();
            }

            function editarCategoria(){
                Categoria.findOne({
                    _id: req.body.id
                }).then((categoria) => {
                    categoria.nome = req.body.nome;
                    categoria.slug = req.body.slug;

                    categoria.save().then(() => {
                        req.flash('success_msg', 'Categoria alterada com sucesso');
                        res.redirect('/admin/categorias');
                    }).catch((err) => {
                        req.flash('error_msg', erroInterno);
                        res.redirect('/admin/categoria');
                    });
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao editar a categoria');
                    res.redirect('/admin/categorias');
                });
            }
        });


        // Delete


        router.post('/categorias/deletar', ehAdmin, (req, res) => {
            Categoria.deleteOne({
                _id: req.body.id
            }).then(() => {
                req.flash('success_msg', 'Categoria deletada com sucesso');
                res.redirect('/admin/categorias');
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao deletar a categoria');
                res.redirect('/admin/categorias');
            });
        });


// Postagens


    // Read


    router.get('/postagens', ehAdmin, (req, res) => {
        Postagem.find().populate('categoria').then((postagens) => {
            res.render('admin/postagens', {
                postagens: postagens
            });
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as postagens');
            res.redirect('/admin/postagens');
        });    
    });


    // Create


    router.get('/postagens/add', ehAdmin, (req, res) => {
        Categoria.find().then((categorias) => {
            res.render('admin/addpostagens', {
                categorias: categorias
            }); 
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao carregar o fomulário');
            res.redirect('/admin/addpostagens');
        });
    });

    router.post('/postagens/nova', ehAdmin, (req, res) => {
        var erros = [];

        if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
            erros.push({
                texto: 'Título inválido'
            });
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({
                texto: 'Slug inválido'
            });
        }
        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
            erros.push({
                texto: 'Descrição inválida'
            });
        }
        if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
            erros.push({
                texto: 'Conteúdo inválido'
            });
        }
        if(req.body.categoria == '0'){
            erros.push({
                texto: 'Categoria inválida, registre uma categoria'
            });
        }

        if(erros.length > 0){
            res.render('admin/addpostagens', {
                erros: erros
            });
        } else {
            cadastrarPostagem();
        }

        function cadastrarPostagem(){
            const novaPostagem = {
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria,
                autor: req.user.nome
            }
            new Postagem(novaPostagem).save().then(() => {
                req.flash('success_msg', 'A postagem foi cadastrada com sucesso');
                res.redirect('/admin/postagens');
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao cadastrar a postagem');
                res.redirect('/admin/postagens')
            });
        }  
    });


    // Update


    router.get('/postagens/edit/:id', ehAdmin, (req, res) => {
        Postagem.findOne({
            _id: req.params.id
        }).then((postagem) => {
            Categoria.find().then((categorias) => {
                res.render('admin/editpostagens', {
                    postagem: postagem,
                    categorias: categorias
                });
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao listar as categorias');
                res.redirect('/admin/postagens');
            });
           
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulário');
            res.redirect('admin/postagens');
        });
    });

    router.post('/postagens/edit/', ehAdmin, (req, res) => {
        Postagem.findOne({
            _id: req.body.id
        }).then((postagem) => {
            postagem.titulo = req.body.titulo;
            postagem.slug = req.body.slug;
            postagem.descricao = req.body.descricao;
            postagem.conteudo = req.body.conteudo;
            postagem.categoria = req.body.categoria;

            postagem.save().then(() => {
                req.flash('success_msg', 'Postagem editada com sucesso');
                res.redirect('/admin/postagens');
            }).catch((err) => {
                req.flash('error_msg', erroInterno);
                res.redirect('/admin/postagens');
            });
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a edição');
            res.redirect('/admin/postagens');
        });
    });


    // Delete


    router.get('/postagens/deletar/:id', ehAdmin, (req, res) => {
        Postagem.remove({
            _id: req.params.id
        }).then(() => {
            req.flash('success_msg', 'Postagem deletada com sucesso');
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', erroInterno);
            res.redirect('/admin/postagens');
        });
    });

// Exportar rotas
    module.exports = router;