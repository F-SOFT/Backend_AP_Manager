const Schedule = require('../models/Schedule');

class ScheduleController {

    //[GET] /schedules/:id
    showClass(req, res, next) {
        Schedule.find({
            classId : req.params.id
        },{
            __v: 0,
            deleted: 0,
        })
        .populate('classId', 'name')
        .populate('courseId', 'name')
        .then(schedule => {
            res.json(schedule)
        })
        .catch(err => {
            res.json({ 
                message: 'Có lỗi! Vui lòng thử lại'
            });
        })
    }

    //[POST] /schedules/store
    store(req, res, next) {
        const schedule = new Schedule(req.body)
        schedule.save()
        .then(schedule => {
            Schedule.findOne({_id : schedule._id})
            .populate('classId', 'name -_id')
            .populate('courseId', 'name -_id')
            .then(data => {
                res.json({
                    message: 'Thêm mới thành công.',
                    data
                })
            })
            .catch(err => {
                res.json({ 
                    message: 'Có lỗi! Vui lòng thử lại'
                });
            })
        })
        
        
    }

    //[PUT] /schedules/:id
    edit(req, res, next) {
        Schedule.findOneAndUpdate({
            _id : req.params.id
        },  req.body, {
            new: true
        })
        .populate('classId', 'name -_id')
        .populate('courseId', 'name -_id')
        .then(schedule => {
            res.json({
                message: 'Đã sửa',
                schedule
            })
        })
        .catch(err => {
            res.json({ 
                message: 'Có lỗi! Vui lòng thử lại'
            });
        })
    }

    //[DELETE] /schedules/:id
    delete(req, res, next) {
        Schedule.findOneAndDelete({
            _id: req.params.id
        })
        .populate('classId', 'name -_id')
        .populate('courseId', 'name -_id')
        .then(schedule => {
            res.json({
                message: 'Đã xóa',
                schedule
            })
        })
        .catch(err => {
            res.json({ 
                message: 'Có lỗi! Vui lòng thử lại'
            });
        })
    }


}

module.exports = new ScheduleController;