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
                username: 0, password: 0, deleted: 0, __v: 0, slug:0, keySearch: 0
            })
            .sort({ fullName: 1 }) .limit(limit) .skip(skip) .populate('rolesId','name') .populate('majorsId','name')
            .then(user => {
                User.countDocuments({})
                .then(total => {
                    let totalRow = total/ limit;
                    res.status(200).json({
                        success: true,
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
                console.log(err);
                res.status(500).json({ 
                    success: false,
                    message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                });
            })
        } else{
            User.countDocuments({})
            .then(total => {
                User.countDocuments({majorsId: '617d7ab0c5c0dfd2a8714e0d', rolesId: '617d04e40682a0a38c0421ca'})
                .then(computings => {
                    User.countDocuments({majorsId: '617d7ac2c5c0dfd2a8714e14', rolesId: '617d04e40682a0a38c0421ca'})
                    .then(businesses => {
                        User.countDocuments({majorsId: '617d7aa1c5c0dfd2a8714e06', rolesId: '617d04e40682a0a38c0421ca'})
                        .then(graphic => {
                            res.status(200).json({
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
                console.log(err);
                res.status(500).json({ 
                    success: false,
                    message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                });
            })
        }
        
    }

    //[GET] /users/information
    info(req, res) {
        User.findOne({ _id: req.user._id }, { rolesId: 0, deleted: 0, _id: 0, __v: 0, createdAt: 0, updatedAt: 0, slug:0, keySearch: 0 })
        .populate('majorsId','name image')
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
            });
        })
    }

    //[GET] /users/personal/:id
    personal(req, res) {
        User.findOne({ _id: req.params.id}, {
            username: 0, password: 0, rolesId: 0, deleted: 0, _id: 0, __v: 0, createdAt: 0, updatedAt: 0, slug:0, keySearch: 0
        })
        .populate('majorsId','name -_id')
        .then(user => {
            res.status(200).json({
                success: true,
                user
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
            });
        })
    }
    
    //[GET] /users/find/:rolesId
    find(req, res) {
        User.find({ rolesId: req.params.id }, {
            username: 0, password: 0, rolesId: 0, deleted: 0,  __v: 0, createdAt: 0, updatedAt: 0, slug:0, keySearch: 0
        })
        .populate('majorsId','name image -_id')
        .then(user => {
            res.status(200).json({
                success: true,
                user
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
            });
        })
    }
    
    // [GET] /users/majors/:id
    majors(req, res, next) {
        User.find({majorsId: req.params.id}, {
            username: 0, password: 0, rolesId: 0, majorsId: 0, avatar: 0, deleted: 0, _id: 0, __v: 0, createdAt: 0, updatedAt: 0, slug:0, keySearch: 0
        })
        .then(user => {
            res.status(200).json({
                success: true,
                user
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
            });
        })
    }

    //[GET] /users/search
    search(req, res) {
        let ojbKey = {};
        if (req.query.keySearch !== '') ojbKey.keySearch = new RegExp(req.query.keySearch, 'i')
        User.find(ojbKey, {
            _id: 1, fullName: 1, userCode: 1
        })
        .limit(15)
        .then(user => {
            res.status(200).json({
                success: true,
                user
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
            });
        })
    }

    //[POST] /users/store
    store(req, res) {
        const {username, password, fullName, userCode, nationality, rolesId, majorsId, email, phone, address, gender, DoB} = req.body;
        if (username !== undefined && password !== undefined && fullName !== undefined && userCode !== undefined && nationality !== undefined && rolesId !== undefined 
            && majorsId !== undefined && email !== undefined && phone !== undefined && address !== undefined && gender !== undefined && DoB !== undefined) {
            User.findOne({ username: req.body.username })
            .populate('rolesId','name') .populate('majorsId','name')
            .then(users => {
                if (users) {
                    res.status(400).json({ 
                        success: false,
                        message: 'Username đã tồn tại! Vui lòng thử lại.' 
                    })
                } else {
                    const {username, fullName, userCode, email, phone} = req.body;
                    const username1 = username.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const fullName1 = fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const userCode1 = userCode.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const email1 = email.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const phone1 = phone.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const keySearch = username1  + ' ' + fullName1 + ' ' + userCode1 + ' ' + email1 + ' ' + phone1 + ' ' + username + ' ' + fullName + ' ' + userCode + ' ' + email + ' ' + phone;
                    const user = new User({username, password, fullName, userCode, nationality, rolesId, majorsId, email, phone, address, gender, DoB, keySearch});
                    return user.save();
                }
            })
            .then( data => {
                return User.findOne({_id: data._id}, { deleted: 0, _id: 0, __v: 0, createdAt: 0, updatedAt: 0, slug:0, keySearch: 0})
                .populate('majorsId', 'name').populate('rolesId', 'name')
            })
            .then( users => {
                res.json({
                    message: 'Đã tạo tài khoản thành công.',
                    users
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ 
                    success: false,
                    message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                });
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin.'
            })
        }
        
    }

    //[POST] /users/login
    login(req, res) {
        User.findOne({
                username: req.body.username, password: req.body.password
            })
            .then(user => {
                if (user) {
                    const token = jwt.sign({ _id: user._id }, 'loginServer');
                    res.status(200).json({
                        success: true,
                        message: 'Đăng nhập thành công',
                        token
                    })
                } else {
                    res.status(400).json({ 
                        success: false,
                        message: 'Tài khoản không tồn tại!' 
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ 
                    success: false,
                    message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                });
            })

    }

    //[PUT] /users/edit/:id
    edit(req, res, next) {
        const {fullName, userCode, nationality, rolesId, majorsId, email, phone, address, gender, DoB} = req.body;
        if( fullName !== undefined && userCode !== undefined && nationality !== undefined && rolesId !== undefined && majorsId !== undefined && email !== undefined 
            && phone !== undefined && address !== undefined && gender !== undefined && DoB !== undefined) {
                User.findOne({_id: req.params.id})
                .then(user => {
                    const username = user.username;
                    const { fullName, userCode, email, phone} = req.body;
                    const username1 = username.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const fullName1 = fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const userCode1 = userCode.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const email1 = email.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const phone1 = phone.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const keySearch = username1  + ' ' + fullName1 + ' ' + userCode1 + ' ' + email1 + ' ' + phone1 + ' ' + username + ' ' + fullName + ' ' + userCode + ' ' + email + ' ' + phone;
                    return User.findOneAndUpdate({_id : req.params.id},{fullName, userCode, nationality, rolesId, majorsId, email, phone, address, gender, DoB, keySearch}, {new: true})
                    
                })
                .then(data => {
                    return User.findOne({_id : data._id}, {usename: 0, password: 0, deleted: 0, _id: 0, __v: 0, createdAt: 0, updatedAt: 0, slug:0, keySearch: 0})
                    .populate('majorsId', 'name').populate('rolesId', 'name')
                })
                .then(user => {
                    res.status(200).json({
                        success: true,
                        message: 'Đã sửa!',
                        user
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ 
                        success: false,
                        message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                    });
                })
        } else {
            res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin.'
            })
        }
    }
    
    //[PUT] /users/update/infomation
    update(req, res, next) {
        const {username, password, fullName, phone, address, gender, DoB} = req.body;
        if (req.file) {
            const avatar = req.file.filename;
            if(username !== undefined && password !== undefined && fullName !== undefined && phone !== undefined && address !== undefined && gender !== undefined && DoB !== undefined) {
                User.findOne({_id: req.user._id})
                    .then(user => {
                        const email = user.email;
                        const userCode = user.userCode;
                        const {username, fullName, phone} = req.body;
                        const username1 = username.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                        const fullName1 = fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                        const userCode1 = userCode.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                        const email1 = email.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                        const phone1 = phone.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                        const keySearch = username1  + ' ' + fullName1 + ' ' + userCode1 + ' ' + email1 + ' ' + phone1 + ' ' + username + ' ' + fullName + ' ' + userCode + ' ' + email + ' ' + phone;
                        return User.findOneAndUpdate({ _id : req.user.id }, { username, password, fullName, phone, address, gender, DoB, avatar, keySearch }, { new: true })
                    })
                    .then(data => {
                        return User.findOne({_id : data._id}, {rolesId: 0, majorsId: 0,  deleted: 0, _id: 0, __v: 0, createdAt: 0, updatedAt: 0, slug:0, keySearch: 0})
                        .populate('majorsId', 'name').populate('rolesId', 'name')
                    })
                    .then(user => {
                        res.status(200).json({
                            success: true,
                            message: 'Đã sửa!',
                            user
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ 
                            success: false,
                            message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                        });
                    })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập đầy đủ thông tin.'
                })
            }
        } else {
            const {username, password, fullName, phone, address, gender, DoB} = req.body;
            if(username !== undefined && password !== undefined && fullName !== undefined && phone !== undefined && address !== undefined && gender !== undefined && DoB !== undefined) {
                User.findOne({_id : req.user.id})
                .then(user => {
                    const email = user.email;
                    const userCode = user.userCode;
                    const {username, fullName, phone} = req.body;
                    const username1 = username.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const fullName1 = fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const userCode1 = userCode.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const email1 = email.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const phone1 = phone.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
                    const keySearch = username1  + ' ' + fullName1 + ' ' + userCode1 + ' ' + email1 + ' ' + phone1 + ' ' + username + ' ' + fullName + ' ' + userCode + ' ' + email + ' ' + phone;
                    return User.findOneAndUpdate({ _id : req.user.id }, { username, password, fullName, phone, address, gender, DoB, keySearch }, { new: true })
                    
                })
                .then(data => {
                    return User.findOne({_id : data._id}, {rolesId: 0, majorsId: 0,  deleted: 0, _id: 0, __v: 0, createdAt: 0, updatedAt: 0, slug:0, keySearch: 0})
                    .populate('majorsId', 'name').populate('rolesId', 'name')
                })
                .then(user => {
                    res.status(200).json({
                        success: true,
                        message: 'Đã sửa!',
                        user
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ 
                        success: false,
                        message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                    });
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập đầy đủ thông tin.'
                })
            }
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
                    console.log(err);
                    res.status(500).json({ 
                        success: false,
                        message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                    });
                })
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
                    console.log(err);
                    res.status(500).json({ 
                        success: false,
                        message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                    });
                })
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
                res.status(200).json({ 
                    success:true,
                    message: 'Đã xóa', 
                    user
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ 
                    success: false,
                    message: 'Lỗi Server! Vui lòng thử lại sau ít phút.' 
                });
            })
    }
}

module.exports = new UserController;