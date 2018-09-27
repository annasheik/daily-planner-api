'use strict';

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
	date: {type: Date, default: new Date().setHours(0,0,0,0)},
	text: {type: String, required: true},
	username: String
})


//const Task = {
//	"tasks":[  
//	{"84765357": ["Doctor appointment", "Finish React Project"]},
//	{"54368732": ["Dog", "Hello"]},
//	{"73632388": ["Hello2", "Fix the phone"]}
//	]
//}
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item.serialize()]);
        } else {
            collection.push(item.serialize());
        }
    });
    return map;
}
function tasksByDate(task) {
	return task.date.getTime();
}

function mapToObject(map) {
	const object = {};
	map.forEach((value, key) => {
		object[key] = value;
	})
	return object;
}

taskSchema.statics.groupByDate = function(tasks) {
	
	const taskText = mapToObject(groupBy(tasks, tasksByDate));
	return taskText;

}  

//Task.find().then(tasks => Tasks.groupByDate(tasks))

taskSchema.methods.serialize = function() {
	return {
		id: this._id,
		date: this.date,
		text: this.text,
		username: this.username
	};
};
const Task = mongoose.model('Task', taskSchema);

module.exports = {Task};