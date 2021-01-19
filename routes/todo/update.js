const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, GetOneTodoParams, PutTodoRequest } = definitions;

/**
 *  Updates one todo
 * 
 *  @param {*} app
 */
exports.update = app => {
   
    app.put('/todo/:id', {
        schema: {
            description: 'Update one todo',
            tags: ['Todo'],
            summary: 'Update one todo',
            body: PutTodoRequest,
            params: GetOneTodoParams,
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
         *  This updates one todo from the database given a unique ID and a payload
         * 
         *  @param {import('fastify').FastifyRequest} request
         *  @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { params, body, user } = request;
            const { username } = user;
            const { id } = params;
            // get text and done from body.
            const { text, done } = body;

            // expect that we should be getting at least a text or a done property
            if (!text && (done === null || done === undefined)) {
                return response
                    .badRequest('request/malformed')
            }

            const oldData = await Todo.findOne({ id, username }).exec();

            if (!oldData) {
                return response
                    .notFound('todo/not-found')
            }

            const update = {};

            if (text) {
                update.text = text;
            }
            if (done !== undefined && done !== null) {
                update.done = done;
            }

            update.dateUpdated = new Date().getTime();

            const data = await Todo.findOneAndUpdate(
                { id },
                update,
                { new: true }
            )
                .exec();
        
            return {
                success: true,
                data
            };
        }
    });
};