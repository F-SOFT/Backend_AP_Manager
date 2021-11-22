const user = require('./userRoute');
const role = require('./roleRoute');
const score = require('./scoreRoute');
const classRoute = require('./classRoute');
const majors = require('./majorsRoute');
const course = require('./courseRoute')
const topic = require('./topicRoute');
const schedule = require('./scheduleRoute');

function Router(app) {

    app.use('/users', user);
    app.use('/roles', role);
    app.use('/scores', score);
    app.use('/class', classRoute);
    app.use('/majors', majors);
    app.use('/courses', course);
    app.use('/topics', topic);
    app.use('/schedules', schedule);

}

module.exports = Router;