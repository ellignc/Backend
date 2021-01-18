const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, GetOneTodoParams } = definitions;

/**
 *  Gets one todo
 * 
 *  @param {*} app
 */
exports.get = app => {
    app.get('/todo/:id', {
        schema: {
            description: 'Get one todo',
            tags: ['Todo'],
            summary: 'Get one todo',
            params: GetOneTodoParams,
            response: {
                200: GetOneTodoResponse
            }
        },
        /**
         *  This gets one todos from the database given a unique ID
         * 
         *  @param {import('fastify').FastifyRequest} request
         *  @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
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
        }
    });
};