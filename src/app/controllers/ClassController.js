const Classes = require('../models/Class');

class ClassControler {
    //[GET] /class
    index(req, res) {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        if(page && limit) {
            Classes.find({},{
                __v: 0, deleted: 0, slug: 0,
            })
            .limit(limit) .skip(skip) .populate('teacherId', 'fullName') .populate('courseId', 'name')
            .then(classes => {
                Classes.countDocuments({})
                .then (total =>{
                    let totalRow = total/ limit; 

                    res.status(200).json({
                        success: true,
                        pagination: {
                            _totalRow: Math.ceil(totalRow), 
                            _limit: limit,
                            _page: page
                        },
                        classes: classes
                    })
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
                })
            });
        } else {
            Classes.countDocuments({})
            .then(total => res.status(200).json({
                success: true,
                total
            }))
            .catch(err => {
                console.log(err);
                res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
                })
            });
        }
    }

    //[GET] /class/courses/:id
    courses(req, res) {
        Classes.find({ courseId: req.params.id}, {
            __v: 0,
            deleted: 0,
            createdAt: 0,
            updatedAt: 0,
            slug: 0
        })
        .populate('studentId', 'fullName userCode')
        .populate('teacherId', 'fullName')
        .then(classes => res.status(200).json({
            success: true,
            classes
        }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
            success: false,
            message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
            })
        });
    }

    //[GET] /class/:id
    show(req, res) {
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
        .then(classInfomation => res.status(200).json({ 
            success: true,
            totalStudent: classInfomation.studentId.length,
            classInfomation
        }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
            success: false,
            message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
            })
        });
    }

    //[GET] /class/user
    user(req, res) {
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
            res.status(200).json({
                success: true,
                classes
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
            success: false,
            message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
            })
        });
    }

    //[GET] /class/check
    check(req, res) {
        const {classId , studentId} = req.query;
        Classes.findOne({ _id: classId, studentId: studentId })
            .then(data => {
                if(data) {
                    res.status(400).json({
                        success: false,
                        message: `Sinh viên đã có trong lớp học.`
                    })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
                })
            });

    }
    //[POST] /class/store
    store(req, res) {
        const { name, classCode, teacherId, courseId } = req.body;
        if (name !== undefined && classCode !== undefined && teacherId !== undefined && courseId !== undefined) {
            Classes.findOne({name: name})
            .then( data => {
                if (data) {
                    return  res.status(400).json({
                        success: false,
                        message:'Tên lớp đã tồn tại! Vui lòng thử lại.'
                    })
                } else {
                    const classes = new Classes({ name, classCode, teacherId, courseId });
                    return classes.save()
                }
            })
            .then((data) => {
                return Classes.findOne({_id: data.id},{
                            deleted: 0, createdAt: 0, updatedAt: 0, _id: 0, __v: 0, slug: 0, studentId: 0
                        })
                       .populate('teacherId', 'fullName -_id')
                       .populate('courseId', 'name -_id')
            })
            .then(classInfomation => {
                return  res.status(200).json({ 
                    success: true,
                    message: 'Thêm mới thành công.',
                    classInfomation
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
                })
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đủ các trường.'
            })
        }
    }

    //[PUT] /class/:id
    edit(req, res) {
        const { name, classCode, teacherId, courseId } = req.body;
        if (name !== undefined && classCode !== undefined && teacherId !== undefined && courseId !== undefined) {
            Classes.findOne({ _id: {$ne: req.params.id}, name: name })
            .then(data => {
                if (data) {
                    return res.status(400).json({
                        success: false,
                        message: 'Tên lớp học đã tồn tại! Vui lòng thử lại.'
                    })
                } else {
                    return Classes.findOneAndUpdate({ 
                        _id: req.params.id
                    },{ 
                        name, classCode, teacherId, courseId 
                    },{ 
                        new: true
                    })
                }
            })
            .then(data => {
                return Classes.findOne({_id : data._id}, {
                       deleted: 0, createdAt: 0, updatedAt: 0, _id: 0, __v: 0, slug: 0, studentId: 0
                       })
                       .populate('teacherId', 'fullName -_id')
                       .populate('courseId', 'name -_id')
            })
            .then(classInfomation => {
                return res.status(200).json({
                    success: true,
                    message: 'Đã sửa.',
                    classInfomation
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
                })
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đủ các trường.'
            })
        }
    }

    //[PATCH] /class/student/:id
    editStudent(req, res) {
        const studentId = req.body.studentId;
        if(studentId !== undefined){
            Classes.findOneAndUpdate({ 
                _id: req.params.id
            },{
                $push: {
                    studentId: studentId
                }
            }, {
                new: true
            })
            .then(data => {
                return Classes.findOne({ _id: data._id}, {
                    deleted: 0, createdAt: 0, updatedAt: 0, _id: 0, __v: 0, slug: 0
                    })
                    .populate('studentId', 'fullName userCode -_id')
                    .populate('teacherId', 'fullName -_id')
                    .populate('courseId', 'name -_id')
            })
            .then(classInfomation => {
                res.status(200).json({
                    success: true,
                    message: 'Đã thêm sinh viên vào lớp học.',
                    classInfomation
                })
            })
            .catch(err =>{ 
                console.log(err);
                res.status(500).json({ 
                    success: false,
                    message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
                })
            });
        } else {
            res.status(400).json({ 
                 success: false,
                message: 'Vui lòng chọn một học sinh.'
            })
        }

    }

    //[PATCH] /class/remove/student/:id
    removeStudent(req, res) {
        const studentId = req.body.studentId;
        if(studentId !== undefined) {
            Classes.findOneAndUpdate({
                _id: req.params.id
            }, {
                $pull: {
                    studentId: req.body.studentId
                }
            }, {
                new: true
            })
            .then(data => {
                return Classes.findOne({ _id: data._id}, {
                    deleted: 0, createdAt: 0, updatedAt: 0, _id: 0, __v: 0, slug: 0
                    })
                    .populate('studentId', 'fullName userCode -_id')
                    .populate('teacherId', 'fullName -_id')
                    .populate('courseId', 'name -_id')
            })
            .then(classInfomation => {
                res.status(200).json({
                    success: true,
                    message: 'Đã xóa sinh viên khỏi lớp học.',
                    classInfomation
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
                })
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Vui lòng chọn 1 sinh viên để xóa.'
            })
        }
        
    }

    //[DELETE] /class/:id
    delete(req, res) {
        Classes.findOneAndDelete({_id: req.params.id})
        .then(classes => res.status(200).json({ 
            success: true,
            message: 'Xóa thành công.',
            classes
        }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
            success: false,
            message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
            })
        });
    }
}

module.exports = new ClassControler; 