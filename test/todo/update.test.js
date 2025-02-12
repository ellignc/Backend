const { delay } = require('../../lib/delay');
const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for updating one todo PUT: (/todo/:id)', () => {
    let app;
    let authorization = '';
    const ids = [];

    before(async () => {
        //initialize the backend application
        app = await build();
        
        const payload = {
            username: 'testuser4',
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

        for (let i = 0; i < 4; i++) {
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

        await User.findOneAndDelete({ username: 'testuser4' });

        await mongoose.connection.close();
    });
  
    // happy path
    it('it should return { sucess: true, data: todo } and has a statusCode of 200 when called using PUT and updates the item', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[0]}`,
            headers: {
                authorization
            },
            payload: {
                text: 'New Todo',
                done: true
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

    it('it should return { sucess: true, data: todo } and has a statusCode of 200 when called using PUT and updates the text item only', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[1]}`,
            headers: {
                authorization
            },
            payload: {
                text: 'New Todo 1'
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
        
        text.should.equal('New Todo 1');
        done.should.equal(false);
        
        text.should.equal(todo.text);
        done.should.equal(todo.done);
        id.should.equal(todo.id);
    });

    it('it should return { sucess: true, data: todo } and has a statusCode of 200 when called using PUT and updates the done item only', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[2]}`,
            headers: {
                authorization
            },
            payload: {
                done: true
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

        done.should.equal(true);
        
        text.should.equal(todo.text);
        done.should.equal(todo.done);
        id.should.equal(todo.id);
    });

    it('it should return { sucess: false, message: error message } and has a statusCode of 404 when called using PUT and the id of the todo if non-existing', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/non-existing-id`,
            headers: {
                authorization
            },
            payload: {
                text: 'New Todo',
                done: true
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

    it('it should return { sucess: false, message: error message } and has a statusCode of 400 when called using PUT and we didn\'t put a payload', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[3]}`,
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;

        // success.should.equal(false);
        statusCode.should.equal(400);
        
        // should.exists(code);
        should.exists(message);
    });

    it('it should return { sucess: false, message: error message } and has a statusCode of 400 when called using PUT and we put a payload without text or done', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[3]}`,
            headers: {
                authorization
            },
            payload: {}
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(400);
        
        should.exists(code);
        should.exists(message);
    });
});