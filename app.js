const fastify =  require('fastify');
const { routes } = require('./routes');

/**
 *  This is the function to call to initialize the server
 * 
 *  @param {{ logger: boolean, trustProxy: boolean }} opts
 *  @returns {*}
 */
exports.build = async (opts = {logger: true, trustProxy: true}) => {
    // initializes our server using Fastify
    const app = fastify(opts);

    routes(app);

    return app;

};