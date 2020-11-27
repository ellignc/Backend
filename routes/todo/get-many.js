const { getTodos } = require('../../lib/get-todos');
const { join } = require('path');

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
    app.get('/todo', (request) => {
        const { query } = request;
        const { limit = 3, startDate } = query;
        const encoding = 'utf8';
        const filename = join(__dirname, '../../database.json');
        const todos = getTodos(filename, encoding);
        const data = [];
        
        if (!startDate) {
            // if there is no startDate, we should sort the todos in a 
            // descending order based on 
            // dateUpdated
            todos.sort((prev, next) => next.dateUpdated - prev.dateUpdated);
            // sorts the todos in ascending order based on 
            // dateUpdated
        } else {
            todos.sort((prev, next) => prev.dateUpdated - next.dateUpdated);
        }

        for (const todo of todos) {
            // if there is no startDate (which is the default)
            // or the todo updated is within the startDate range
            // it should do inside
            if (!startDate || startDate <= todo.dateUpdated) {
                // if data.lengthis still below the specified limit
                if (data.length < limit) {
                    data.push(todo);
                }        
            }            
        }

        // if we want to sort it in descending order
        // we should put next first and subtract it with
        // the previous.
        data.sort((prev, next) => next.dateUpdated - prev.dateUpdated);
    
        return {
            success: true,
            data
        };
    });
};