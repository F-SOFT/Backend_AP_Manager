const Role = require('../models/Role');

class RoleController {

    index(req, res, next) {
       Role.find({}, {
           __v: 0, 
           deleted: 0,
           createdAt: 0,
           updatedAt:0,
           slug: 0
        })
       .then(role => {
           res.json(role);
       })
    }

    //[POST] /roles/store
    store(req, res) {
        const role = new Role(req.body);
        role.save()
            .then(roles => {
                res.json({
                    message: 'Thêm thành công!',
                    roles
                })
            })
            .catch(err => {
                res.json({
                    message: 'Có lỗi! Vui lòng thử lại.'
                })
            });
    }

    //[PUT] /roles/:id
    edit(req, res) {
        Role.findOneAndUpdate({
            _id: req.params.id
        }, 
            req.body,{
            new: true
        })
        .then(role => {
            res.json({message: 'Đã sửa!'}),
            role
        })
        .catch(err => res.json({message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[DELETE] /roles/:id
    delete(req, res) {
        Role.findOneAndDelete({_id: req.params.id})
        .then(role => {
            res.json({message: 'Đã xóa!'}),
            role
        })
        .catch(err => res.json({message: 'Có lỗi ! Vui lòng thử lại'}));
    }
}

module.exports = new RoleController;