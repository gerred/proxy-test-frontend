'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    port: process.env.PORT 
});

server.register({
    register: require('h2o2')
}, function(err) {
    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
})

// Add the route
server.route({
    method: '*',
    path:'/foo', 
    handler: {
        proxy: {
            redirects: 5,
            passThrough: true,
            xforward: true,
            mapUri: function(req, cb) {
                cb(null, 'http://proxy-backend.krancour.deis.ninja/foo')
            }
        }
    }
});