'use strict';

// Exportar helper
    module.exports = {
        ehAdmin: function(req, res, next){
            if(req.isAuthenticated() && req.user.ehAdmin == 1){
                return next();
            } else {
                req.flash('error_msg', 'Você não tem permissão para acessar essa página');
                res.redirect('/');
            }
        }
    }