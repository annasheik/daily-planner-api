'use strict';

const express = require('express');
const {Task} = require('./models');

const router = express.Router();
router.use(express.json());

//GET request
router.get('/', (req, res) => {
	Task
	.find()
	.then(tasks => {
		res.json({tasks : Task.groupByDate(tasks)})
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({message: 'Internal server error'});
	});

});

//POST request
router.post('/', (req, res) => {
	const requiredField = 'text';
	if(!(requiredField in req.body)) {
		console.error('Missing Text field');
		return res.status(400).send('Missing Text field');
	}
	Task
	.create({
		//username: req.user.username,
		text: req.body.text
	})
	.then(tasks => res.status(201).json(tasks.serialize))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: 'Internal service error'})
	})
})

//DELETE request
router.delete('/:id', (req, res) => {
	Task
	.findById(req.params.id)
	.then(function(task) {
		//if (req.user.username = task.username) {
			Task
			.findByIdAndRemove(req.params.id)
			.then(task => res.status(204).end())
		//}
		//else {
		//	res.status(401).json({message: 'Unauthorized user'})
//
	})
	.catch(err => res.status(500).json({message: 'Internal server error'}))
})


module.exports = {router};
