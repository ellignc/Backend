const {todo} = require('./todo');

/**
 *  initialize all the routes
 * 
 *  @param {*} app
 */
exports.routes = app => {
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

    todo(app);
}