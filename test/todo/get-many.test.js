const { getTodos } = require('../../lib/get-todos');
const { delay } = require('../../lib/delay');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { build } = require('../../app');
require('should');
require('tap').mochaGlobals();

describe('For the route for getting many todos GET: (/todo)', () => {
    let app;
    const ids = [];
    const filename = join(__dirname, '../../database.json');
    const encoding = 'utf8';

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
               
        const todos = getTodos(filename, encoding);

        for (const todo of data) {
            const { text, done, id } = todo;
            const index = todos.findIndex(todo => todo.id === id);
            index.should.not.equal(-1);
            const { text: textDatabase, done: doneDatabase } = todos[index];
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
               
        const todos = getTodos(filename, encoding);

        for (const todo of data) {
            const { text, done, id } = todo;
            const index = todos.findIndex(todo => todo.id === id);
            index.should.not.equal(-1);
            const { text: textDatabase, done: doneDatabase } = todos[index];
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
        
        const todos = getTodos(filename, encoding);

        // sort it in descending order
        todos.sort((prev, next) => next.dateUpdated - prev.dateUpdated);

        const todo = todos[0];        
        const responseTodo = data[0];

        todo.id.should.equal(responseTodo.id);
    });

    it('it should return { sucess: true, data: array of todos } and has a statusCode of 200 when called using GET and has a default limit of 3 items and it should be in descending order where the last item is updated on or after startDate', async () => {
        const todos = getTodos(filename, encoding);
        const id = ids[parseInt(Math.random() * ids.length)];
        const index = todos.findIndex(todo => todo.id === id);
        const { dateUpdated: startDate } = todos[index];

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