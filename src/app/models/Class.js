const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const mongooseSlugGenerator = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

//add plugin
mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {
    deleteAt: true,
    overrideMethods: 'all'
});

const Class = new Schema({
    name: { type: String, required: true },
    classCode: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    teacherId: { type: String, ref: 'User' },
    studentId: [{ type: String, ref: 'User' }],
    courseId: { type: String, ref: 'Course'}
}, {
    timestamps: true,
});

module.exports = mongoose.model('Class', Class);