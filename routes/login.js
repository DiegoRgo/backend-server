var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        //Verifica si existe el email ingresado
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        //Varifica Contrasenia
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: err
            });
        }


        //Craer token de confiramcion
        usuarioBD.password = '';
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });


        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id

        });
    });
});



module.exports = app;