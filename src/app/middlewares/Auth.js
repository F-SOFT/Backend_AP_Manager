const jwt = require('jsonwebtoken');

const User = require('../models/User');

class Auth {
    auth(req, res, next) {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.json({
                error: 'Bạn chưa đăng nhập!',
                message: 'Vui lòng đăng nhập để tiếp tục.'
            })
        }
        try {
            const userId = jwt.verify(token, 'loginServer');
            User.findOne({ _id: userId })
                .then(user => {
                    if (user) {
                        req.user = user;
                        next();
                    }
                })
        } catch (err) {
            res.json({ message: 'Có lỗi! Vui lòng thử lại!' });
        }
    }
}

module.exports = new Auth;