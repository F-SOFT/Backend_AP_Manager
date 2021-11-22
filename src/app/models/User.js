const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

// add plugins
mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

const User = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    userCode: { type: String },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String },
    address: { type: String },
    nationality: { type: String },
    gender: { type: String },
    DoB: { type: String },
    slug: { type: String, slug: 'fullName', unique: true },
    rolesId: { type: String, ref: 'Role' },
    majorsId: { type: String, ref: 'Majors' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);