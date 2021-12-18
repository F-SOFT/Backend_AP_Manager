const path = require('path');

const Majors = require('../models/Majors');
const { majors } = require('./CourseController');

class MajorsController {

    show(req, res) {
        Majors.find({}, { __v: 0, deleted: 0 }) 
        .then(majors => {
            res.status(200).json({
                succcess:true,
                majors
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

    //[POST] /majors/store
    store(req, res) {
        const {name, description} = req.body;
        const image = req.file.filename;
        if ( name !== undefined && description !== undefined && req.file) {
            if(req.image.mimetype == 'image/png' || req.image.mimetype == 'image/jpeg') {
                Majors.findOne({name: name})
                .then(majors => {
                    if(majors) {
                        res.status(400).json({
                            success: false,
                            message: 'Chuyên nghành này đã tồn tại. Vui lòng thử lại!'
                        })
                    } else {
                        const majors = new Majors({
                            name: req.body.name,
                            description: req.body.description,
                            iamge: req.file.filename
                        })
                        return majors.save();
                    }
                })
                .then(data => {
                    Majors.findOne({_id : data._id})
                    .then(majors => {
                        res.status(200).json({ 
                            success: true,
                            message: 'Tạo mới thành công.',
                            majors
                        });
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
                    message: 'Vui lòng tải tiệp có định dạng JPG hoặc PNG '
                })
            }
            
        } else {
            res.status(400).json({
                succes: false,
                message: 'Vui lòng nhập đủ các trường.'
            })
        }
       
        
    }

    //[PUT] /majors/:id
    edit(req, res) {
        if ( !req.body.name == '' &&
             !req.body.description == ''
         ) {
            Majors.findOneAndUpdate({
                _id: req.params.id
            }, 
                req.body, {
                new: true
            })
            .then(majors => {
                res.json({
                    message: 'Đã sửa!',
                    majors
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
            res.json({message: 'Vui lòng nhập đủ các trường.'})
        }
        
    }

    //[PATCH] /majors/change/image
    changeImage(req, res) {
        if (req.iamge) {
            if(req.image.mimetype == 'image/png' || req.image.mimetype == 'image/jpeg'){
                Majors.findByIdAndUpdate({
                    _id: req.params.id
                }, {
                    image: req.file.filename
                }, {
                    new: true
                })
                .then(majors => {
                    res.json({
                        message: 'Đã sửa!',
                        majors
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
                res.json({message: 'Vui lòng tải tiệp có định dạng JPG hoặc PNG '})
            }
        } else {
                res.json({message: 'Vui lòng chọn một file.'})
        }
    }

    //[DELETE] /majors/:id
    delete(req, res) {
        Majors.findOneAndDelete({_id: req.params.id})
        .then(majors => {
            res.json({
                message: 'Đã Xóa!',
                majors
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

module.exports = new MajorsController;