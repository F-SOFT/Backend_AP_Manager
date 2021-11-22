const mongoose = require('mongoose');

const api = 'mongodb+srv://tung:1234@app.apqgl.mongodb.net/DB_AP_Manager?retryWrites=true&w=majority';

async function connect() {
    try {
        await mongoose.connect(api);
        console.log('Connect to DB done!!!');
    } catch (err) {
        console.log('Connect to DB false!!!');
    }
}

module.exports = { connect };