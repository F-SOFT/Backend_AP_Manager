const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

//add plugin
mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {
    deleteAt: true,
    overrideMethods: 'all'
});

const Topic = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    slug: { type: String, slug: 'name', unique: true },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Topic', Topic);