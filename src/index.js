const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

const db = require('./config/db');
const Route = require('./routes');

//connect to DB
db.connect();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

//Router init
Route(app);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})