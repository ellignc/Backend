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
            }
        },
        /**
         *  This updates one todo from the database given a unique ID and a payload
         * 
         *  @param {import('fastify').FastifyRequest} request
         *  @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { params, body } = request;
            const { id } = params;
            // get text and done from body.
            const { text, done } = body;

            // expect that we should be getting at least a text or a done property
            if (!text && (done === null || done === undefined)) {
                return response
                    .code(400)
                    .send({
                        success: false,
                        code: 'todo/malformed',
                        message: 'Payload doesn\'t have text property'
                    });
            }

            const oldData = await Todo.findOne({ id }).exec();

            if (!oldData) {
                return response
                    .code(404)
                    .send({
                        success: false,
                        code: 'todo/not-found',
                        message: 'Todo doesn\'t exist'
                    });
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