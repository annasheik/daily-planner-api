'use strict';
const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const {TEST_DATABASE_URL} = require('../config');
const faker = require('faker');

const {Task} = require('../tasks')
const {app, runServer, closeServer} = require('../server');
const {User} = require('../users')

chai.use(chaiHttp);

function generateTasks() {
	// Generate an object representing Tasks
	return {
		text: [faker.random.words()],
		username
	}
};
function seedOneTask() {
	const seedData = [];
	for (let i=1; i<=2; i++) {
		seedData.push(generateTasks());
	};
	return Task.insertMany(seedData);
}

// Put random documents in db
function seedTasksData() {
	console.info('Seeding Tasks data');
	const seedData = [];
	for (let i=1; i<=10; i++) {
		seedData.push(generateTasks());
	};
	return Task.insertMany(seedData);
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

const username = 'Anna';
const password = "12345";
let jwt;

describe('Tasks API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function() {
		return User.hashPassword(password).then(password =>
      User.create({
        username,
        password
      })
    )
		.then(function() {
			return chai.request(app)
			.post('/api/auth/login')
			.send({username, password})
		})
		.then(function(res) {
			jwt = res.body.authToken;
		return seedTasksData()
	    })
	});
	afterEach(function() {
		return tearDownDb();
	});
	after(function() {
		return closeServer();
	});

	describe('GET endpoint', function() {
		it('should return all existing tasks for user', function() {
			////strategy:
			// 1.get back all tasks returned by GET req to '/api/tasks'
			// 2. prove res has status 200 and correct data type
			// 3. prove the num of entries we got is equal to num in DB
			let res;
			return chai.request(app)
			.get('/api/tasks')
			.set('Authorization', `Bearer ${jwt}`)
			.then(function(_res) {
				res=_res;
				expect(res).to.have.status(200);
				expect(res.body.tasks).to.be.a('object');
			})
		});
		it('should return tasks with right fields', function() {
			////Strategy: Make GET req and ensure the tasks have the right fileds
			let resTask;
			let oneTask;
			return chai.request(app)
			.get('/api/tasks')
			.set('Authorization', `Bearer ${jwt}`)
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				
				let taskDate = Object.keys(res.body.tasks);
				expect(res.body.tasks[taskDate]).to.be.a('array');
				expect(res.body.tasks[taskDate]).to.have.lengthOf.at.least(1);
				res.body.tasks[taskDate].forEach(function(task) {
					expect(task).to.be.a('object');
					expect(task).to.include.keys('id', 'text', 'date');
				});
				resTask = res.body.tasks[taskDate];
				oneTask =resTask[0];
				return Task.findById(oneTask.id);
			})
			.then(function(task) {
				expect(oneTask.id).to.equal(task.id);
				expect(oneTask.text).to.equal(task.text);
			});
		});
	})


	describe('POST endpoint', function() {
		//strategy:
		// 1. make a POST req with data 
		// 2. Prove that the task we get back has right keys
		// 3. Make sure it has id
		it('should add a new task', function() {
			const newTask = generateTasks();
			return chai.request(app)
			.post('/api/tasks')
			.set('Authorization', `Bearer ${jwt}`)
			.send(newTask)
			.then(function(res) {
				console.log(res.body)
				expect(res).to.have.status(201);
				expect(res).to.be.json;
			//	expect(res.body).to.include.keys('id', 'text');
			//	expect(res.body.id).to.equal(newTask.id);
			//	expect(res.body.text).to.equal(newTask.text);
				
			});
		});
	});

	describe('DELETE endpoint', function() {
		//strategy;
		// 1. Get a task
		// 2. Make a delete req for that task id
		// 3. Prove the res has status 204
		// 4. Prove the task with that id doesn't exist in db
		it('should delete task by id', function() {
			let task;
			return Task
			.findOne()
			.then(function(_task) {
				task=_task;
				return chai.request(app)
				.delete(`/api/tasks/${task.id}`)
				.set('Authorization', `Bearer ${jwt}`)
			})
			.then(function(res) {
				expect(res).to.have.status(204);
			  	return Task.findById(task.id)
			})
			.then(function(_task) {
				expect(_task).to.be.null;
			})
		})
	})
 








})