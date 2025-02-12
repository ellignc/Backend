const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for creating a todo POST: (/todo)', () => {
    let app;
    const authorization = '';
    const ids = [];

    before(async () => {
        //initialize the backend application
        app = await build();
        const payload = {
            username: 'testuser',
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
    });

    after(async () => {
        // clean up the database
        for (const id of ids) {
            await Todo.findOneAndDelete({ id });
        }

        await User.findOneAndDelete({ username: 'testuser' });

        await mongoose.connection.close();
    });
    
    // happy path
    it('it should return {sucess: true, data: (new todo object)} and has a statusCode of 200 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            headers: {
                authorization
            },
            payload: {
                text: 'This is a todo',
                done: false
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { text, done, id } = data;

        success.should.equal(true);
        statusCode.should.equal(200);
        text.should.equal('This is a todo');
        done.should.equal(false); 
       
        const {
            text: textDatabase,
            done: doneDatabase
        } = await Todo
            .findOne({ id })
            .exec();
        
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);

        // add the id in the ids array for cleaning
        ids.push(id);
    });

    // another happy path but a different way of sending data.
    it('it should return {sucess: true, data: (new todo object)} and has a statusCode of 200 when called using POST even if we don\'t provide the done property. Default of done should still be false', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            headers: {
                authorization
            },
            payload: {
                text: 'This is a todo 2'
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { text, done, id } = data;

        success.should.equal(true);
        statusCode.should.equal(200);
        text.should.equal('This is a todo 2');
        done.should.equal(false);
        
        const {
            text: textDatabase,
            done: doneDatabase
        } = await Todo
            .findOne({ id })
            .exec();
        
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);

        // add the id in the ids array for cleaning
        ids.push(id);
    });

    // non-happy path
    it('it should return {sucess: false, message: error message } and has a statusCode of 400 when called using POST and there is no text', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            headers: {
                authorization
            },
            payload: {
                done: true
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(400);
        success.should.equal(false);
        should.exist(message);
    })

    // another non-happy path
    it('it should return {sucess: false, message: error message } and has a statusCode of 400 when called using POST and there is no payload', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(400);
        success.should.equal(false);
        should.exist(message);
    })
});