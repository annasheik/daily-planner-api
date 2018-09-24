'use strict';

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
	date: {type: Date, default: new Date().setHours(0,0,0,0)},
	text: {type: String, required: true}
})


const Task = {
	"84765357": ["Doctor appointment", "Finish React Project"],
	"54368732": ["Dog", "Hello"],
	"73632388": ["Hello2", "Fix the phone"]
}

module.export = {Task};