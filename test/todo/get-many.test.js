const { delay } = require('../../lib/delay');
const { mongoose, Todo } = require('../../db');
const { build } = require('../../app');
require('should');
require('tap').mochaGlobals();

describe('For the route for getting many todos GET: (/todo)', () => {
    let app;
    const ids = [];

    before(async () => {
        //initialize the backend application
        app = await build();

        for (let i = 0; i < 5; i++) {
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
        for (const id of ids){
            await Todo.findOneAndDelete({ id });            
        }
        
        await mongoose.connection.close();
    });
  
    // happy path
    it('it should return { sucess: true, data: array of todos } and has a statusCode of 200 when called using GET and has a default limit of 3 items', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/todo'
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(3);

        for (const todo of data) {
            const { text, done, id } = todo;

            const {
                text: textDatabase,
                done: doneDatabase
            } = await Todo
                .findOne({ id })
                .exec();
            
            text.should.equal(textDatabase);
            done.should.equal(doneDatabase);    
        }
    });   
    
    it('it should return { sucess: true, data: array of todos } and has a statusCode of 200 when called using GET and has a limit of 2 items', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/todo?limit=2'
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(2);
               
        for (const todo of data) {
            const { text, done, id } = todo;

            const {
                text: textDatabase,
                done: doneDatabase
            } = await Todo
                .findOne({ id })
                .exec();

            text.should.equal(textDatabase);
            done.should.equal(doneDatabase);    
        }
    });   
    
    it('it should return { sucess: true, data: array of todos } and has a statusCode of 200 when called using GET and has a default limit of 3 items and it should be in descending order', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/todo'
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(3);
               
        for (let i = 0; i < data.length - 1; i++) {
            const prevTodo = data[i];
            const nextTodo = data[i + 1];

            (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true);
        }
    });

    it('it should return { sucess: true, data: array of todos } and has a statusCode of 200 when called using GET and has a default limit of 3 items and it should be in descending order where the first item should be the latest updated item in the database', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/todo'
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(3);
               
        for (let i = 0; i < data.length - 1; i++) {
            const prevTodo = data[i];
            const nextTodo = data[i + 1];

            (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true);
        }
        
        const todos = await Todo
            .find()
            .limit(3)
            .sort({
                dateUpdated: -1
            })
            .exec();
        
        const todo = todos[0];        
        const responseTodo = data[0];

        todo.id.should.equal(responseTodo.id);
    });

    it('it should return { sucess: true, data: array of todos } and has a statusCode of 200 when called using GET and has a default limit of 3 items and it should be in descending order where the last item is updated on or after startDate', async () => {
        const id = ids[parseInt(Math.random() * ids.length)];

        const { dateUpdated: startDate } = await Todo
            .findOne({ id })
            .exec();

        const response = await app.inject({
            method: 'GET',
            url: `/todo?startDate=${startDate}`
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        (data.length <= 3).should.equal(true);
               
        for (let i = 0; i < data.length - 1; i++) {
            const prevTodo = data[i];
            const nextTodo = data[i + 1];

            (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true);
        }
        
        // the last data should be equal to the picked id
        data[data.length - 1].id.should.equal(id);
    });
});