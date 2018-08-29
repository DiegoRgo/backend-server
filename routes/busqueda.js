var express = require('express');
var app = express();

var Usuario = require('../models/usuario');

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestaBusqueda => {

            res.status(200).json({
                ok: true,
                usuario: respuestaBusqueda[0]
            });
        });

    buscarUsuarios(busqueda, regex).then(usuario => {
        res.status(200).json({
            ok: true,
            usuario: usuario
        });
    });

});

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuario) => {

                if (err) {
                    reject('Error al cargar Usuarios', err);
                } else {
                    resolve(usuario);
                }
            });
    });


}

module.exports = app;