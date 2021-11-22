const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

//add plugin
mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {
    deleteAt: true,
    overrideMethods: 'all'
})

const Schedule = new Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    shifts: { type: String, required: true },
    rooms: { type: String, required: true },
    classId: { type: String, ref: 'Class' },
    courseId: { type: String, ref: 'Course' }
})

module.exports = mongoose.model('Schedule', Schedule);