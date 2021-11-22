const path = require('path');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

class UserController {
    //[GET] /users
    index(req, res) {
            res.sendFile(path.join(__dirname, '../../public/views/createUser.html'));
    }
    //[GET] /users
    show(req, res) {
        let page = req.query.page;
        let limit = req.query.limit;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;
        if(page){
            User.find({ }, {
                username: 0,
                password: 0,
                deleted: 0,
                __v: 0,
                slug:0
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('rolesId','name')
            .populate('majorsId','name')
            .then(user => {
                User.countDocuments({})
                .then(total => {
                    let totalRow = total/ limit;
                    res.json({
                        pagination: {
                            _totalRow: Math.ceil(totalRow), 
                            _limit: limit,
                            _page: page
                        },
                        user: user 
                    })
                })
            })
            .catch(err => {
                res.json({ message: 'Có lỗi! Vui lòng thử lại' });
            })
        } else{
            User.countDocuments({})
            .then(total => {
                User.countDocuments({majorsId: '617d7ab0c5c0dfd2a8714e0d'})
                .then(computings => {
                    User.countDocuments({majorsId: '617d7ac2c5c0dfd2a8714e14'})
                    .then(businesses => {
                        User.countDocuments({majorsId: '617d7aa1c5c0dfd2a8714e06'})
                        .then(graphic => {
                            res.json({
                                _total: total,
                                _totalcomputing: computings,
                                _totalGraphic: graphic,
                                _totalBusinesses: businesses
                            })
                        })
                    })
                })
            })
            .catch(err => {
                res.json({ message: 'Có lỗi! Vui lòng thử lại' });
                })
        }
        
    }

    //[GET] /users/information
    info(req, res) {
        User.findOne({ _id: req.user._id }, {
            username: 0,
            password: 0,
            rolesId: 0,
            deleted: 0,
            _id: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
            slug:0
        })
        .populate('majorsId','name -_id')
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.json({ message: 'Có lỗi! Vui lòng thử lại' });
        })
    }
    
    // [GET] /users/majors/:id
    majors(req, res, next) {
        User.find({majorsId: req.params.id}, {
            username: 0,
            password: 0,
            rolesId: 0,
            majorsId: 0,
            avatar: 0,
            deleted: 0,
            _id: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
            slug:0
        })
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.json({ message: 'Có lỗi! Vui lòng thử lại' });
        })

    }

    //[POST] /users/register
    register(req, res) {
        User.findOne({ username: req.body.username })
            .then(user => {
                if (user) {
                    res.json({ message: 'Tên người dùng đã tồn tại! Vui lòng thử lại.' });
                } else {
                    const users = new User(req.body);
                    return users.save();
                }
            })
            .then(data => {
                User.findOne({_id : data._id })
                .populate('rolesId','name')
                .populate('majorsId','name')
                .then( users => {
                    res.json({
                        message: 'Đã tạo tài khoản thành công.',
                        users
                    })
                })
                .catch(err => {
                    res.json({ message: 'Có lỗi! Vui lòng thử lại' })
                });
            })     
    }

    //[POST] /users/store
    store(req, res) {
        User.findOne({ username: req.body.username })
            .populate('rolesId','name')
            .populate('majorsId','name')
            .then(users => {
                if (users) {
                    res.json({ message: 'Username đã tồn tại! Vui lòng thử lại.' })
                } else {
                    const user = new User({
                        username: req.body.username,
                        password: req.body.password,
                        fullName: req.body.fullName,
                        userCode: req.body.userCode,
                        nationality: req.body.nationality,
                        rolesId: req.body.rolesId,
                        majorsId: req.body.majorsId,
                        email: req.body.email,
                        phone: req.body.phone,
                        address: req.body.address,
                        gender: req.body.gender,
                        DoB: req.body.DoB,
                    })
                    return user.save();
                    
                }
            })
            .then(data => {
                User.findOne({_id : data._id })
                .populate('rolesId','name')
                .populate('majorsId','name')
                .then( users => {
                    res.json({
                        message: 'Đã tạo tài khoản thành công.',
                        users
                    })
                })
                .catch(err => {
                    res.json({ message: 'Có lỗi! Vui lòng thử lại' })
                });
            })     
    }

    //[POST] /users/login
    login(req, res) {
        User.findOne({
                username: req.body.username,
                password: req.body.password
            })
            .then(user => {
                if (user) {
                    const token = jwt.sign({ _id: user._id }, 'loginServer');
                    res.json({
                        message: 'Đăng nhập thành công',
                        token
                    })
                } else {
                    res.json({ message: 'Tài khoản không tồn tại!' });
                }
            })
            .catch(err => {
                res.json({ message: 'Có lỗi! Vui lòng thử lại' });
            })

    }

    //[PUT] /users/:id
    edit(req, res, next) {
        User.findOneAndUpdate({ 
            _id: req.params.id 
        },
            req.body, {
            new: true
        }
        )
        .populate('majorsId','name')
        .populate('rolesId','name')
        .then(user => {
                res.json({
                    message: 'Đã sửa!',
                    user
                })
            })
            .catch(err => {
                res.json({ message: 'Có lỗi! Vui lòng thử lại!!' });
            })
        }

    //[PATCH] /users/change/avatar
    changeAvatar(req, res) {
        User.findOneAndUpdate({_id: req.user._id}, { 
            avatar: req.file.filename
        })
            .then(user => {
                res.json({ message: 'Đã sửa!'})
            })
            .catch(err => {
                res.json({ message: 'Có lỗi! Vui lòng thử lại.'})
            });
    }

    //[PATCH] /users/change/password
    changePassword(req, res) {
        User.findOneAndUpdate({ _id: req.user._id},{ 
            password: req.body.password 
        }, {
            new: true
        })
            .then(user => {
                res.json({
                     message: 'Đã sửa!',
                     user
                })
            })
            .catch(err => {
                res.json({ message: 'Có lỗi! Vui lòng thử lại.'})
            });
        }

    //[DELETE] /users/
    delete(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
            .populate('majorsId','name')
            .populate('rolesId','name')
            .then((user) => {
                res.json({ 
                    message: 'Đã xóa', 
                    user
                })
            })
            .catch(() => res.json({ message: 'Có lỗi! Vui lòng thử lại' }));
    }
}

module.exports = new UserController;