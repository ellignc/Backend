const { delay } = require('../../lib/delay');
const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for getting one todo GET: (/todo/:id)', () => {
    let app;
    let authorization = '';
    const ids = [];

    before(async () => {
        //initialize the backend application
        app = await build();

        const payload = {
            username: 'testuser3',
            password: 'password1234567890'
        }

        await app.inject({
            method: 'POST',
            url: '/user',
            payload
        });

        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload
        });
        const { data: token } = response.json();

        authorization = `Bearer ${token}`;

        for (let i = 0; i < 1; i++) {
            const response = await app.inject({
                method: 'POST',
                url: '/todo',
                headers: {
                    authorization
                },
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
        for (const id of ids){
            await Todo.findOneAndDelete({ id });            
        }
        
        await User.findOneAndDelete({ username: 'testuser3' });

        await mongoose.connection.close();
    });
  
    // happy path
    it('it should return { sucess: true, data: todo } and has a statusCode of 200 when called using GET', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/${ids[0]}`,
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { text, id, done } = data;

        success.should.equal(true);
        statusCode.should.equal(200);
        
        const todo = await Todo
            .findOne({ id })
            .exec();

        text.should.equal(todo.text);
        done.should.equal(todo.done);
        id.should.equal(todo.id);
    });

    it('it should return { sucess: false, message: error message } and has a statusCode of 404 when called using GET and the id of the todo if non-existing', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/non-existing-id`,
            headers: {
                authorization
            }
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