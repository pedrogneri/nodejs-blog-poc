'use strict';

// Definição do servidor mongoDB
    if(process.env.NODE_ENV == 'production'){
        module.exports = {mongoURI: 'mongodb://pedrogneri:abc123@ds034208.mlab.com:34208/blogapp-nodeproj'}
    } else {
        module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
    }