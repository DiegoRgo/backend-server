var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//===================================================================================
//Varificacion mediante token (MIDDLEWARE)
//===================================================================================

exports.verificacionToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        //Con este funcion si el token es valido, puede ejecutar las siguietes funciones
        next();

    });
};