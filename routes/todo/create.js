const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, PostTodoRequest } = definitions;

/**
 *  this is the route for creating todo's
 * 
 *  @param {*} app
 */
exports.create = app => {
    app.post('/todo', {
        schema: {
            description: 'Create one todo',
            tags: ['Todo'],
            summary: 'Create one todo',
            body: PostTodoRequest,
            response: {
                200: GetOneTodoResponse
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
         *  handles the request for a given route
         * 
         *  @param {import('fastify').FastifyRequest} request
         *  @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { body, user } = request;
            // get text and done with default false from body, regardless if it has
            // an object value or null, which makes it return an empty object.
            const { text, done = false } = body;
            const { username } = user;

            const data =  new Todo({
                text,
                done,
                username,
            });

            await data.save();

            return{
                success: true,
                data
            }
        }
    })
};