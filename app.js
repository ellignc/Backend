const fastify =  require('fastify');

/**
 *  This is the function to call to initialize the server
 * 
 *  @param {{ logger: boolean, trustProxy: boolean }} opts
 *  @returns {*}
 */
exports.build = async (opts = {logger: true, trustProxy: true}) => {
    // initializes our server using Fastify
    const app = fastify(opts);

    // access root address - http://localhost/
    app.get('/', {
        // object

        /**
         *  @param {*} req - this is the request parameter that is sent by the client
         *  handles the request for a given route
         */
        handler: async (req) => {
            // this is the response in JSON
            return {success: true}
        }
    });

    return app;

};