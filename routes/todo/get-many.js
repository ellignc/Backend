const { Todo } = require('../../db');

/**
 *  Gets many todos
 * 
 *  @param {*} app
 */
exports.getMany = app => {
    /**
     *  This gets the todos from the database
     * 
     *  @param {import('fastify').FastifyRequest} request
     */
    app.get('/todo', async (request) => {
        const { query } = request;
        const { limit = 3, startDate } = query;
        
        // if there is a startDate, the query
        // should search the dateUpdated property
        // if dateUpdated is greater than or equal
        // to the startDate
        // 
        // if there is no startDate, it will search for
        // all given the limit
        const options = startDate
            ? {
                dateUpdated: {
                    $gte: startDate
                }
            }
            :   {};

        const data = await Todo
            .find(options)
            .limit(parseInt(limit))
            .sort({
                dateUpdated: -1
            })
            .exec();
        
        return {
            success: true,
            data
        };
    });
};