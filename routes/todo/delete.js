const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { SuccessResponse, GetOneTodoParams } = definitions;

/**
 *  Delete one todo
 * 
 *  @param {*} app
 */
exports.deleteOne = app => {
    app.delete('/todo/:id', {
        schema: {
            description: 'Delete one todo',
            tags: ['Todo'],
            summary: 'Delete one todo',
            params: GetOneTodoParams,
            response: {
                200: SuccessResponse
            },
            security: [
                {
                    bearer: []
                }
            ]
        },
        preHandler: app.auth([
            app.verifyJWT
        ]),
        /**
        *  This deletes one todo from the database given a unique ID
        * 
        *  @param {import('fastify').FastifyRequest} request
        *  @param {import('fastify').FastifyReply<Response>} response
        */
        handler: async (request, response) => {
            const { params } = request;
            const { id } = params;

            const data = await Todo.findOneAndDelete({ id }).exec();
            
            if (!data) {
                return response
                    .notFound('todo/not-found')
            }

            return {
                success: true
            };
        }
    });
};