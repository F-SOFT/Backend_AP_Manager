const Schedule = require('../models/Schedule');

class ScheduleController {

    //[GET] /schedules/classCode/:id
    showUser(req, res, next) {
        Schedule.find({}, { _id: 0, __v: 0, createdA: 0, updatedAt: 0, deleted: 0 })
        .populate('classId', 'name classCode -_id').populate('courseId', 'name -_id')
        .then( schedule => {
           let data = schedule.filter(x =>  x.classId.classCode === req.params.id)
           res.status(200).json({
               success: true,
               data
           })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
            });
        })
    }

    //[POST] /schedules/store
    store(req, res, next) {
        const schedule = new Schedule(req.body)
        schedule.save()
        .then(schedule => {
            return Schedule.findOne({_id : schedule._id})
            .populate('classId', 'name -_id')
            .populate('courseId', 'name -_id')
        })
        .then(data => {
            res.status(200).json({
                success: false,
                message: 'Thêm mới thành công.',
                data
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
            });
        })
        
    }

    //[PUT] /schedules/:id
    edit(req, res, next) {
        Schedule.findOneAndUpdate({ _id : req.params.id },  req.body, { new: true })
        .populate('classId', 'name -_id').populate('courseId', 'name -_id')
        .then(schedule => {
            res.status(200).json({
                success: true,
                message: 'Đã sửa',
                schedule
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
            });
        })
    }

    //[DELETE] /schedules/:id
    delete(req, res, next) {
        Schedule.findOneAndDelete({ _id: req.params.id })
        .populate('classId', 'name -_id').populate('courseId', 'name -_id')
        .then(schedule => {
            res.status(200).json({
                success: true,
                message: 'Đã xóa',
                schedule
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
            });
        })
    }


}

module.exports = new ScheduleController;