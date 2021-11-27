const path = require('path');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

class UserController {
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
        .populate('majorsId','name image -_id')
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.json({ message: 'Có lỗi! Vui lòng thử lại' });
        })
    }
    
    //[GET] /users/find/:rolesId
    find(req, res) {
        User.find({ rolesId: req.params.id }, {
            username: 0,
            password: 0,
            rolesId: 0,
            deleted: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
            slug:0
        })
        .populate('majorsId','name image -_id')
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

    //[GET] /users/search
    search(req, res) {
        let ojbKey = {};
        if (req.query.keySearch !== '') ojbKey.keySearch = new RegExp(req.query.keySearch, 'i')
        User.find(ojbKey)
        .then( user => res.json({message: 'ok', user}))
        .catch(err => res.json({message: 'Có lỗi ! Vui lòng thử lại'}));
    }

    //[POST] /users/register
    register(req, res) {
        if (
            req.body.username !== '' &&
            req.body.password !== '' &&
            req.body.userName !== ''
        ) {
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
        } else {
            res.json({
                message: 'Vui lòng nhập đầy đủ thông tin.'
            })
        }
        
    }

    //[POST] /users/store
    store(req, res) {
        if (req.body.username !== '' &&
            req.body.password !== '' &&
            req.body.fullName !== '' &&
            req.body.userCode !== '' &&
            req.body.nationality !== '' &&
            req.body.rolesId !== '' &&
            req.body.majorsId !== '' &&
            req.body.email !== '' &&
            req.body.phone !== '' &&
            req.body.address !== '' &&
            req.body.gender !== '' &&
            req.body.DoB !== '') {
            User.findOne({ username: req.body.username })
            .populate('rolesId','name')
            .populate('majorsId','name')
            .then(users => {
                if (users) {
                    res.json({ message: 'Username đã tồn tại! Vui lòng thử lại.' })
                } else {
                    const {username, fullName, userCode, email, phone} = req.body;
                    const username1 = username.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const fullName1 = fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const userCode1 = userCode.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const email1 = email.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const phone1 = phone.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const keySearch = username1  + ' ' + fullName1 + ' ' + userCode1 + ' ' + email1 + ' ' + phone1 + ' ' + username + ' ' + fullName + ' ' + userCode + ' ' + email + ' ' + phone;
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
                        keySearch: keySearch
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
        } else {
            res.json({
                message: 'Vui lòng nhập đầy đủ thông tin.'
            })
        }
        
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
        if (req.body.username !== '' &&
            req.body.password !== '' &&
            req.body.fullName !== '' &&
            req.body.userCode !== '' &&
            req.body.nationality !== '' &&
            req.body.rolesId !== '' &&
            req.body.majorsId !== '' &&
            req.body.email !== '' &&
            req.body.phone !== '' &&
            req.body.address !== '' &&
            req.body.gender !== '' &&
            req.body.DoB !== ''
        ) {
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
        } else {
            res.json({ message: 'Có lỗi! Vui lòng kiểm tra lại' });
        }
        
    }
    //[PATCH] /users/change/avatar
    changeAvatar(req, res) {
        if (req.file){
            User.findOneAndUpdate({_id: req.user._id}, { 
                avatar: req.file.filename
            })
                .then(user => {
                    res.json({ message: 'Đã sửa!'})
                })
                .catch(err => {
                    res.json({ message: 'Có lỗi! Vui lòng thử lại.'})
                });
        } else {
            res.json({
                message: 'Vui lòng chọn file!'
            })
        }
    }

    //[PATCH] /users/change/password
    changePassword(req, res) {
        if (req.body.password !== '') {
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
        } else {
            res.json({ message: 'Mật khẩu không thể để trống!'})
        }
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