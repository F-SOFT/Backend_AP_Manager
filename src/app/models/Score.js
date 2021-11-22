const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

// add plugin
mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {
    deleteAt: true,
    overrideMethods: 'all'
})

const Score = new Schema({
    point: { type: String},
    status: { type: String },
    comment: { type: String },
    dotTime: { type: String},
    teacherId: { type: String, ref: 'User' },
    studentId: { type: String, ref: 'User' },
    courseId: { type: String, ref: 'Course' },
    classId: { type: String, ref: 'Class'}
}, {
    timestamps: true,
})

module.exports = mongoose.model('Score', Score);