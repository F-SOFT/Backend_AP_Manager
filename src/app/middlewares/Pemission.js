const User = require('../models/User');

class Permission {
    admin(req, res, next) {
        User.findOne({ _id: req.user._id })
            .populate('rolesId')
            .then(user => {
                const roles = user.rolesId.name;
                if (roles === 'admin') {
                    next();

                } else {
                    return res.json({ message: 'Bạn không có quyền truy cập!!!' });
                }
            })
    }

    trainingStaff(req, res, next) {
        User.findOne({ _id: req.user._id })
            .populate('rolesId')
            .then(user => {
                const roles = user.rolesId.name;
                if (roles === 'admin' || roles === 'training-staff') {
                    next();

                } else {
                    return res.json({ message: 'Bạn không có quyền truy cập!!!' });
                }
            })
    }

    trainer(req, res, next) {
        User.findOne({ _id: req.user._id })
            .populate('rolesId')
            .then(user => {
                const roles = user.rolesId.name;
                if (roles === 'admin' || roles === 'training-staff' || roles === 'trainer') {
                    next();

                } else {
                    return res.json({ message: 'Bạn không có quyền truy cập!!!' });
                }
            })
    }

    trainee(req, res, next) {
        User.findOne({ _id: req.user._id })
            .populate('rolesId')
            .then(user => {
                const roles = user.rolesId.name;
                if (roles === 'admin' || roles === 'training-staff' || roles === 'trainer' || roles === 'trainee') {
                    next();

                } else {
                    return res.json({ message: 'Bạn không có quyền truy cập!!!' });
                }
            })
    }
}

module.exports = new Permission;