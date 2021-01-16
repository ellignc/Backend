const { Todo } = require('../../db');

/**
 *  Gets one todo
 * 
 *  @param {*} app
 */
exports.get = app => {
    /**
     *  This gets one todos from the database given a unique ID
     * 
     *  @param {import('fastify').FastifyRequest} request
     *  @param {import('fastify').FastifyReply<Response>} response
     */
    app.get('/todo/:id', async (request, response) => {
        const { params } = request;
        const { id } = params;

        const data = await Todo.findOne({ id }).exec();

        if (!data) {
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not-found',
                    message: 'Todo doesn\'t exist'
                });
        }
    
        return {
            success: true,
            data
        };
    });
};