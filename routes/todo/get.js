const { getTodos } = require('../../lib/get-todos');
const { join } = require('path');

/**
 *  Gets one todos
 * 
 *  @param {*} app
 */
exports.get = app => {

    /**
     *  This gets one todos from the database given a unique ID
     * 
     *  @param {import('fastify').FastifyRequest} request
     */
    app.get('/todo/:id', (request) => {
        const { params } = request;
        const { id } = params;

        const encoding = 'utf8';
        const filename = join(__dirname, '../../database.json');
        const todos = getTodos(filename, encoding);
        
        const index = todos.findIndex(todo => todo.id === id);

        const data = todos[index];
        
        return {
            success: true,
            data
        };
    });
};