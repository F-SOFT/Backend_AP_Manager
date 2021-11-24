const path = require('path');
const Course = require('../models/Course');

class CourseController {

    test(req, res, next) {
        res.sendFile(path.join(__dirname, '../../public/view.html'))
    }
    //[GET] /courses
    show(req, res, next) {
        let page = req.query.page;
        let limit = req.query.limit;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;
        if(limit) {
            Course.find({}, {
                __v: 0,
                slug: 0,
                deleted: 0
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('majorsId','name')
            .then(courses => {
                Course.countDocuments({})
                .then(total => {
                    let totalRow = total/ limit;
                    res.json({
                        pagination: {
                            _totalRow: Math.ceil(totalRow), 
                            _limit: limit,
                            _page: page
                        },
                        courses: courses
                    })
                })
            })
            .catch(err => {
                res.json({ message: 'Có lỗi! Vui lòng thử lại'})
            });
        }else {
            Course.countDocuments({})
            .then(total => {
                res.json({total: total});
            })
            .catch(err => {
                res.json({ message: 'Có lỗi! Vui lòng thử lại'})
            });
        }
    }

    //[GET] / course/majors/:id
    majors(req, res, next) {
        Course.find({majorsId: req.params.id}, {
            __v: 0,
            slug: 0,
            deleted: 0,
            createAt: 0,
            updatedAt: 0
        })
        .then(course => {
            res.json(course);
        })
        .catch(err =>res.json({message : 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[GET] / course/detail
    detail(req, res, next) {
        Courses.findOne({_id: req.params.id}, {
            _id: 0,
            __v: 0,
            slug: 0,
            deleted: 0,
            createAt: 0,
            updatedAt: 0
        })
        .populate('majorsId','name')
        .then(course => {
            res.json(course);
        })
        .catch(err =>res.json({message : 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[POST] /course/store
    store(req, res, next) {
        if ( !req.body.name == '' &&
             !req.body.description == '' &&
             !req.body.level == '' &&
             !req.body.majorsId == '' &&
             req.image
         ) {
            if(req.image.mimetype == 'image/png' || req.image.mimetype == 'image/jpeg') {
                Course.findOne({ name: req.body.name})
                .then(course => {
                    if (course) {
                        res.json({message: 'Tên Khóa học này đã tồn tại. Vui lòng thử lại!'})
                    } else {
                        const course = new Course({
                            name: req.body.name,
                            description: req.body.description,
                            level: req.body.level,
                            majorsId: req.body.majorsId,
                            image: req.file.filename
                        });
                        return course.save();
                    }
                })
                .then(course => {
                    Course.findOne({_id : course._id})
                    .populate('majorsId','name')
                    .then(data => {
                        res.json({
                            message: 'Thêm mới thành công.',
                            data
                        })
                    })
                    .catch(err =>{ 
                        res.json({message: 'Có lỗi! Vui lòng thử lại'})
                    });
                })
            } else {
                res.json({message: 'Vui lòng tải tiệp có định dạng JPG hoặc PNG '})
            }
            
            
        } else {
            res.json({message: 'Vui lòng nhập đủ các trường.'})
        }
        
        
    }

    //[PUT] /courses/:id
    edit(req, res, next) {
        if ( !req.body.name == '' &&
             !req.body.description == '' &&
             !req.body.level == '' &&
             !req.body.majorsId == ''
         ) {
             Course.findOneAndUpdate({ _id: req.params.id },
                 req.body, {
                 new: true
             })
             .populate('majorsId','name')
             .then(course => {
                 res.json({
                     message: 'Đã sửa!',
                     course
                 })
             })
             .catch(err => {
                 res.json({ message: 'Có lỗi! Vui lòng thử lại'})
             });
         } else {
            res.json({message: 'Vui lòng nhập đủ các trường.'})
         }
    }

    //[PATCH] /course/change/image
    changeImage(req, res, next) {
        if (req.iamge) {
            if(req.image.mimetype == 'image/png' || req.image.mimetype == 'image/jpeg'){
                Course.findOneAndUpdate({ _id: req.params.id }, {
                    image: req.file.filename
                }, {
                    new: true
                })
                .then(course => {
                    res.json({
                        message: 'Đã sửa!',
                        course
                    })
                })
                .catch(err => {
                    res.json({ message: 'Có lỗi! Vui lòng thử lại'})
                });
            } else {
                res.json({message: 'Vui lòng tải tiệp có định dạng JPG hoặc PNG '})
            }
        } else {
            res.json({message: 'Vui lòng chọn một file.'})
        }
    }

    //[DELETE] /courses/:id
    delete(req, res, next) {
        Course.findOneAndDelete({_id: req.params.id})
        .then(course => {
            res.json({
                message: 'Đã xóa!',
                course
            })
        })
        .catch(err => {
            res.json({ message: 'Có lỗi! Vui lòng thử lại'})
        });
    }
}

module.exports = new CourseController;