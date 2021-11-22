const Score = require('../models/Score');

class ScoreController {
    //[GET] /scores
    index(req, res, next) {
        Score.find({},{
            __v: 0,
            deleted: 0
        })
        .populate('teacherId', 'fullName')
        .populate('studentId', 'fullName')
        .populate('courseId', 'name ')
        .then(score => res.json(score))
        .catch(err => res.json({message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[GET] /scores/class/:id
    showClass(req, res, next) {
        Score.find({classId: req.params.id},{
            deleted: 0,
            createdAt: 0,
            updatedAt: 0
        })
        .populate('courseId', 'name')
        .populate('classId', 'name')
        .then(score => res.json(score))
        .catch(err => res.json({message: 'Có lỗi ! Vui lòng thử lại'}));
    }
    
    //[GET] /scores/user/:id
    user(req, res, next) {
        Score.find({studentId: req.params.id},{
            deleted: 0,
            createdAt: 0,
            updatedAt: 0
        })
        .populate('courseId', 'name')
        .populate('classId', 'name')
        .then(score => res.json(score))
        .catch(err => res.json({message: 'Có lỗi ! Vui lòng thử lại'}));
    }
    
    //[GET] /scores/:classId
    show(req, res, next) {
        Score.find({
            classId: req.params.classId,
            studentId: req.user._id,
        })
        .populate('teacherId', 'fullName')
        .populate('studentId', 'fullName')
        .populate('courseId', 'name ')
        .then(score => res.json(score))
        .catch(err => res.json({message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[POST] /scores/store
    store(req, res, next) {
        const score = new Score({
            point: '00:00',
            status: 'chưa chấm',
            comment: 'chưa có comment',
            dotTime:'default',
            teacherId: req.body.teacherId,
            studentId: req.body.studentId,
            courseId: req.body.courseId,
        })
        score.save()
        .then(score => {
            res.json({ 
                message: 'Đăng kí khóa học thành công.',
                score
            })
        })
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[PUT]/scores/:id
    edit(req, res, next) {
        Score.findOneAndUpdate({
            _id: req.params.id 
        }, {
            point: req.body.point,
            status: 'đã chấm',
            comment: req.body.comment,
            dotTime: req.body.dotTime
        }, {
            new: true
        })
        .then(score => {
            res.json({ 
                message: 'Đã chấm.',
                score
            })
        })
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[DELETE]/scores/:id
    delete(req, res, next) {
        Score.findOneAndDelete({_id: req.params.id})
        .then(score => {
            res.json({ 
                message: 'Đã xóa!',
                score
            })
        })
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại'}));
    }

}

module.exports = new ScoreController;