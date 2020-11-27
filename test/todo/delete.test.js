const { getTodos } = require('../../lib/get-todos');
const { delay } = require('../../lib/delay');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for deleting one todo DELETE: (/todo/:id)', () => {
    let app;
    const ids = [];
    const filename = join(__dirname, '../../database.json');
    const encoding = 'utf8';

    before(async () => {
        //initialize the backend application
        app = await build();

        for (let i = 0; i < 1; i++) {
            const response = await app.inject({
                method: 'POST',
                url: '/todo',
                payload: {
                    text: `Todo ${i}`,
                    done: false
                }
            });    

            const payload = response.json();
            const { data } = payload;
            const { id } = data;
    
            ids.push(id);
            await delay(1000);
        }
    });

    after(async () => {
        // clean up the database
        const todos = getTodos(filename, encoding);
        for (const id of ids){
            // find the index
            const index = todos.findIndex(todo => todo.id === id);

            // delete the id
            if (index >= 0) {
                todos.splice(index, 1);
            }

            writeFileSync(filename, JSON.stringify({ todos }, null, 2), encoding);
        }
    });
  
    // happy path
    it('it should return { success: true } and has a statusCode of 200 when called using DELETE', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/todo/${ids[0]}`
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success } = payload;
        const id = ids[0];

        success.should.equal(true);
        statusCode.should.equal(200);
        
        const todos = getTodos(filename, encoding);
        const index = todos.findIndex(todo => todo.id === id);
        index.should.equal(-1);
    });

    it('it should return { sucess: false, message: error message } and has a statusCode of 404 when called using DELETE and the id of the todo if non-existing', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/todo/non-existing-id`
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(404);
        
        should.exists(code);
        should.exists(message);
    });
});