'use strict';

// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');
    const admin = require('./routes/admin');
    const usuarios = require('./routes/usuario');
    const path = require('path');
    require('./models/Postagem');
    const Postagem = mongoose.model('postagens');
    require('./models/Categoria');
    const Categoria = mongoose.model('categorias');
    const passport = require('passport');
    require('./config/auth')(passport);
    const db = require('./config/db');
    
    const app = express();

// Error 
    const erroInterno = 'Houve um erro interno';
    const postagemInex = 'Essa postagem não existe';
    const categoriaInex = 'Essa categoria não existe';


// Config
    // Session 
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg'); 
            res.locals.error = req.flash('error');
            res.locals.user = req.user || null;
            next();
        });
    // Body Parser{
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());
    // Handlebars 
        app.engine('handlebars', handlebars({
            defaultLayout: 'main'
        }));
        app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI, {
            useNewUrlParser: true 
        }).then(() => {
            console.log('Conectado ao mongodb')
        }).catch((err) => {
            console.log('Houve algum erro: ' + err);
        });
    // Public
        app.use(express.static(path.join(__dirname, 'public')));

// Rotas
    app.get('/', (req, res) => {
        Postagem.find().populate('categoria').sort({
            data: 'desc'
            }).then((postagens) => {
            res.render('index', {
                postagens: postagens
            });
        }).catch((err) => {
            req.flash('error_msg', erroInterno);
            res.redirect('/404');
        });
    });

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({
            slug: req.params.slug
        }).populate('categoria').then((postagem) => {
            if(postagem){
                res.render('postagem/index', {
                    postagem: postagem
                });
            } else{
                req.flash('error_msg', postagemInex);
                res.redirect('/');
            }
        }).catch(() => {
            req.flash('error_msg', erroInterno);
            res.redirect('/');
        });
    });

    app.get('/categorias', (req, res) => {
        Categoria.find().then((categorias) => {
            res.render('categorias/index', {
                categorias: categorias
            });
        }).catch((err) => { 
            req('error_msg', erroInterno);
            res.redirect('/');
        });
    });

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({
            slug: req.params.slug
        }).then((categoria) => {
            if(categoria){
                Postagem.find({
                    categoria: categoria._id
                }).then((postagens) => {
                    res.render('categorias/postagens', {
                        postagens: postagens,
                        categoria: categoria
                    });
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar os posts');
                });
            } else {
                req.flash('error_msg', categoriaInex);
                res.redirect('/categorias', )
            }
        }).catch((err) => {
            req.flash('error_msg', erroInterno);
            res.redirect('/categorias');
        });
    });

    app.get('/404', (req, res) => {
        res.send('<h1>Erro 404<h1>');
    });

    app.use('/admin', admin);
    app.use('/usuarios', usuarios);

// Outros
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor rodando...');
});
