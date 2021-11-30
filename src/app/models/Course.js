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

const Course = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    level: { type: String, required: true },
    keySearch: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    teacherId: { type: String, ref: 'User'},
    majorsId: { type: String, ref: 'Majors' },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Course', Course);