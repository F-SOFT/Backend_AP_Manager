const Classes = require('../models/Class');

class ClassControler {
    //[GET] /class
    index(req, res, next) {
        Classes.find({},{
            __v: 0,
            deleted: 0,
            slug: 0,
        })
        .populate('teacherId', 'fullName')
        .populate('courseId', 'name')
        .then(classes => res.json(classes))
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[GET] /class/courses/:id
    courses(req, res, next) {
        Classes.find({ courseId: req.params.id}, {
            __v: 0,
            deleted: 0,
            createdAt: 0,
            updatedAt: 0,
            slug: 0
        })
        .populate('studentId', 'fullName userCode')
        .populate('teacherId', 'fullName')
        .then(classes => res.json(classes))
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[GET] /class/:id
    show(req, res, next) {
        Classes.findOne({_id: req.params.id},{
            _id: 0,
            __v: 0,
            deleted: 0,
            createdAt: 0,
            updatedAt: 0,
            slug: 0
        })
        .populate('studentId', 'fullName userCode')
        .populate('teacherId', 'fullName')
        .then(classes => res.json(classes))
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[GET] /class/user
    user(req, res, next) {
        Classes.find({ studentId : req.user.id }, {
            __v: 0,
            slug: 0,
            createdAt: 0,
            updatedAt: 0,
            deleted: 0,
            courseId: 0,
            teacherId: 0,
            studentId: 0
        })
        .then(classes => {
            res.json(classes)
        })
        .catch(err => {
            console.log(err)
            res.json({ message: 'Có lỗi! Vui lòng thử lại'})
        });
    }

    //[POST] /class/store
    store(req, res, next) {
        const classes = new Classes({
            name: req.body.name,
            classCode: req.body.classCode,
            teacherId: req.body.teacherId,
            studentId: req.body.studentId,
            courseId: req.body.courseId
        });
        classes.save()
        .then(classes => {
            res.json({ 
                message: 'Thêm mới thành công.',
                classes
            })
        })
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại.'}));
    }

    //[PUT] /class/:id
    edit(req, res, next) {
        Classes.findOneAndUpdate({ 
            _id: req.params.id
        },
             req.body, {

        },{ 
            new: true
        })
        .then(classes => res.json({
                message: 'Đã sửa.',
                classes
            }))
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại.'}));
    }

    //[PATCH] /class/student/:id
    editStudent(req, res, next) {
        Classes.findOneAndUpdate({ 
            _id: req.params.id
        },{
            $push: {
                studentId: req.body.studentId
            }
        }, {
            new: true
        })
        .then(classes => res.json({
            message: 'Đã thêm sinh viên vào lớp học.',
            classes
        }))
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại.'}));
    }

    //[PATCH] /class/remove/student/:id
    removeStudent(req, res, next) {
        Classes.findOneAndUpdate({
            _id: req.params.id
        }, {
            $pull: {
                studentId: req.body.studentId
            }
        }, {
            new: true
        })
        .then(classes => res.json({
            message: 'Đã xóa sinh viên khỏi lớp học.',
            classes
        }))
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại.'}));
    }

    //[DELETE] /class/:id
    delete(req, res, next) {
        Classes.findOneAndDelete({_id: req.params.id})
        .then(classes => res.json({ 
            message: 'Xóa thành công.',
            classes
        }))
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại.'}));
    }
}

module.exports = new ClassControler; 