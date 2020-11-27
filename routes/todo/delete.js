const { getTodos } = require('../../lib/get-todos');
const { writeFileSync } = require('fs');
const { join } = require('path');

/**
 *  Delete one todo
 * 
 *  @param {*} app
 */
exports.deleteOne = app => {
    /**
     *  This deletes one todo from the database given a unique ID
     * 
     *  @param {import('fastify').FastifyRequest} request
     *  @param {import('fastify').FastifyReply<Response>} response
     */
    app.delete('/todo/:id', (request, response) => {
        const { params } = request;
        const { id } = params;

        const encoding = 'utf8';
        const filename = join(__dirname, '../../database.json');
        const todos = getTodos(filename, encoding);
        
        const index = todos.findIndex(todo => todo.id === id);

        if (index < 0) {
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not-found',
                    message: 'Todo doesn\'t exist'
                });
        }

        todos.splice(index, 1);

        // we added null and 2 when stringify-ing the object so that
        // the JSON file looks visually understandable
        const newDatebaseStringContents = JSON.stringify({ todos }, null, 2);
        writeFileSync(filename, newDatebaseStringContents, encoding);

        return {
            success: true
        };
    });
};