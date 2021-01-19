const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetManyTodoResponse, GetManyTodoQuery } = definitions;

/**
 *  Gets many todos
 * 
 *  @param {*} app
 */
exports.getMany = app => {
    app.get('/todo', {
        schema: {
            description: 'Gets many todos',
            tags: ['Todo'],
            summary: 'Gets many todos',
            query: GetManyTodoQuery,
            response: {
                200: GetManyTodoResponse
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
         */
        handler: async (request) => {
            const { query, user } = request;
            const { username } = user;
            const { limit = 3, startDate, endDate } = query;

            const options = {
                username
            };

            if (startDate) {
                options.dateUpdated = {};
                options.dateUpdated.$gte = startDate;
            }

            if (endDate) {
                options.dateUpdated = options.dateUpdated || {};
                options.dateUpdated.$lte = endDate;
            }

            const data = await Todo
                .find(options)
                .limit(parseInt(limit))
                .sort({
                    // this forces to start the query on startDate if and when
                    // startDate only exists.
                    dateUpdated: startDate && !endDate ? 1 : -1
                })
                .exec();

            // force sort to do a descending order
            if (startDate && !endDate) {
                data.sort((prev, next) => next.dateUpdated - prev.dateUpdated)
            }
            
            return {
                success: true,
                data
            };
        }
    });
};