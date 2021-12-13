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
        if(page && limit) {
            Course.find({}, { slug: 0, deleted: 0 })
            .sort({ createdAt: -1 }) .limit(limit) .skip(skip).populate('majorsId','name')
            .then(courses => {
                Course.countDocuments({})
                .then(total => {
                    let totalRow = total/ limit;
                    res.status(200).json({
                        success: true,
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
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
                })
            });
        }else {
            Course.countDocuments({})
            .then(total => {
                res.status(200).json({total: total});
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
                })
            });
        }
    }

    //[GET] / course/majors/:id
    majors(req, res, next) {
        Course.find({majorsId: req.params.id}, {
            __v: 0, slug: 0, deleted: 0, createAt: 0, updatedAt: 0
        })
        .then(courses => {
            res.status(200).json({
                success: true,
                courses
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
            })
        });
    }

    //[GET] / course/detail
    detail(req, res, next) {
        Courses.findOne({_id: req.params.id}, {
            _id: 0, __v: 0, slug: 0, deleted: 0, createAt: 0, updatedAt: 0
        })
        .populate('majorsId','name')
        .then(course => {
            res.status(200).json({
                success: true,
                course
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
            })
        });
    }

    //[GET] / course/search
    search(req, res) {
        let ojbkey = {};
        if(req.query.keySearch !== '') ojbkey.keySearch = new RegExp(req.query.keySearch, 'i')
        Course.find(ojbkey, { name: 1 })
        .then(courses => {
            res.status(200).json({
                success: true,
                courses
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'
            })
        });
    }

    //[POST] /course/store
    store(req, res, next) {
        const {name, description, level, majorsId} = req.body;
        if ( name !== undefined && description !== undefined && level !== undefined && majorsId !== undefined, req.file ) {
            if(req.image.mimetype == 'image/png' || req.image.mimetype == 'image/jpeg') {
                Course.findOne({ name: req.body.name})
                .then(course => {
                    if (course) {
                        res.status(400).json({
                            success: false,
                            message: 'Tên Khóa học này đã tồn tại. Vui lòng thử lại!'
                        })
                    } else {
                        const {name, description} = req.body;
                        const name1 = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                        const description1 = description.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                        const keySearch = name + " " + description + " " + name1 + " " + description1;
                        const course = new Course({ name: name,  description: description,  level: level, majorsId: majorsId });
                        return course.save();
                    }
                })
                .then(course => {
                    return Course.findOne({_id : course._id}, {name: 1, description: 1, image: 1, level: 1})
                    .populate('majorsId','name') 
                })
                .then(course => {
                    res.status(200).json({
                        success: true,
                        message: 'Thêm mới thành công.',
                        course
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
                    success: true,
                    message: 'Vui lòng tải tiệp có định dạng JPG hoặc PNG '
                })
            }
        } else {
            res.status(400).json({
                success: true,
                message: 'Vui lòng nhập đủ các trường.'
            })
        }
        
    }

    //[PUT] /courses/:id
    edit(req, res, next) {
        const {name, description, level, majorsId} = req.body;
        const image = req.filename;
        if (req.file) {
            if( name !== undefined && description !== undefined && level !== undefined && majorsId !== undefined && req.file) {
                if(req.image.mimetype == 'image/png' || req.image.mimetype == 'image/jpeg'){
                    const name1 = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const description1 = description.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const keySearch = name + " " + description + " " + name1 + " " + description1;
                    Course.findOneAndUpdate({ 
                        _id: req.params.id 
                    }, {
                        name: name, description: description, level: level, majorsId: majorsId, keySearch: keySearch, image: image
                    }, {
                        new: true
                    })
                    .then(course => {
                        return Course.findOne({_id : course._id}, {name: 1, description: 1, image: 1, level: 1})
                        .populate('majorsId','name') 
                    })
                    .then(course => {
                        res.status(200).json({
                            success: true,
                            message: 'Đã sửa.',
                            course
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
                        success: true,
                        message: 'Vui lòng tải tiệp có định dạng JPG hoặc PNG '
                    })
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập đủ các trường.'
                })
            }
        } else {
            if ( name !== undefined && description !== undefined && level !== undefined && majorsId !== undefined) {
                const name1 = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                const description1 = description.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                const keySearch = name + " " + description + " " + name1 + " " + description1;
                Course.findOneAndUpdate({ 
                    _id: req.params.id 
                }, {
                    name: name, description: description, level: level, majorsId: majorsId, keySearch: keySearch
                }, {
                    new: true
                })
                .then(course => {
                    return Course.findOne({_id : course._id}, {name: 1, description: 1, image: 1, level: 1})
                    .populate('majorsId','name') 
                })
                .then(course => {
                    res.status(200).json({
                        success: true,
                        message: 'Đã sửa.',
                        course
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
                    message: 'Vui lòng nhập đủ các trường.'
                })
             }
        }
    }

    // //[PATCH] /course/change/image
    // changeImage(req, res, next) {
    //     if (req.iamge) {
    //         if(req.image.mimetype == 'image/png' || req.image.mimetype == 'image/jpeg'){
    //             Course.findOneAndUpdate({ _id: req.params.id }, {
    //                 image: req.file.filename
    //             }, {
    //                 new: true
    //             })
    //             .then(course => {
    //                 res.json({
    //                     message: 'Đã sửa!',
    //                     course
    //                 })
    //             })
    //             .catch(err => {
    //                 res.json({ message: 'Lỗi Server! Vui lòng thử lại sau ít phút.'})
    //             });
    //         } else {
    //             res.json({message: 'Vui lòng tải tiệp có định dạng JPG hoặc PNG '})
    //         }
    //     } else {
    //         res.json({message: 'Vui lòng chọn một file.'})
    //     }
    // }

    //[DELETE] /courses/:id
    delete(req, res, next) {
        Course.findOneAndDelete({_id: req.params.id})
        .then(course => {
            res.status(200).json({
                success: true,
                message: 'Đã xóa!',
                course
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
}

module.exports = new CourseController;