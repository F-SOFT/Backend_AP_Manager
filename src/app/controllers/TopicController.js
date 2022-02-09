const Topic = require('../models/Topic');

class TopicController {

    index(req, res, next) {
        Topic.find({},{
            __v: 0,
            deleted: 0,
            createdAt: 0,
            updatedAt: 0,
            slug: 0,
        })
        .then( topic => {
            res.json(topic);
        })
        .catch(err => {
            res.json({ message: 'Có lỗi! Vui lòng thử lại'})
        });
    }

    topic(req, res, next) {
        Topic.findOne({_id: req.params.id},{
            __v: 0,
            deleted: 0,
            createdAt: 0,
            updatedAt: 0,
            slug: 0,
        })
        .then( topic => {
            res.json(topic);
        })
        .catch(err => {
            res.json({ message: 'Có lỗi! Vui lòng thử lại'})
        });
    }


    //[POST] /topics/store
    store(req, res, next) {
        if (!req.body.name == '' && !req.body.description == '') {
            const topic = new Topic(req.body)
            topic.save()
            .then(topic =>{
                res.json({
                    message: 'Thêm mới thành công.',
                    topic
                    })
            })
            .catch(err => {
                res.json({ message:' Có lỗi! Vui lòng thử lại'})
            });
        } else {
            res.json({ message:'Vui lòng nhập đủ các trường.'})
        }
        
    }

    //[PUT] /topic/:id
    edit(req, res, next) {
        if (!req.body.name == '' && !req.body.description == '') {
            Topic.findOneUpdate({ 
                    _id: req.params.id 
                },
                    req.body, {
                    new: true
                }
    
            )
            .then(topic => {
                res.json({ 
                    message: 'Đã sửa!',
                    topic
                })
            })
            .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại'}));
        } else {
            res.json({ message:'Vui lòng nhập đủ các trường.'})
        }
    }

    //[DELETE] /topic/:id
    delete(req, res, next) {
        Topic.findOneAndDelete({
            _id: req.params.id
        })
        .then(topic => {
            res.json({ 
                message: 'Đã xóa!',
                topic
            })
        })
        .catch(err => res.json({ message: 'Có lỗi ! Vui lòng thử lại'}));
    }

}

module.exports = new TopicController;