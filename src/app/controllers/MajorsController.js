const path = require('path');

const Majors = require('../models/Majors');

class MajorsController {

    show(req, res, next) {
        Majors.find({}, {
            __v: 0,
            deleted: 0,
        }) 
        .then(majors => res.json(majors))
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[POST] /majors/store
    store(req, res) {
        const majors = new Majors({
            name: req.body.name,
            description: req.body.description
        })
        if(req.file) {
            majors.image = req.file.filename
        }
        majors.save()

        .then(data => {
            res.json({ 
                message: 'Tạo mới thành công.',
                data
            });
        })
        .catch(err => {
            res.json({ message: 'Có lỗi! Vui lòng thử lại'})
        });
        
    }

    //[PUT] /majors/:id
    edit(req, res) {
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
            res.json({ message: 'Có lỗi! Vui lòng thử lại'})
        });
    }

    //[PATCH] /majors/change/image
    changeImage(req, res) {
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
            res.json({ message: 'Có lỗi! Vui lòng thử lại'})
        });
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
            res.json({ message: 'Có lỗi! Vui lòng thử lại'})
        });
    }
}

module.exports = new MajorsController;