var mongoose = require('mongoose')  // 建模工具
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId  // 获取特有id

// 使用了mongoose的populate方法，通过一个字段获取一整个相关数据
// 通过特殊定义的ObjectId也就是_id来获取 相应的数据
var CommentSchema = new Schema({  // 模式定义传入的数据类型
    // 获取movie数据只要传入objectId即可查询整个movie的相关数据
    movie: {
        type: ObjectId,
        ref: 'Movie'     // ref 指的是关联的对象
    },
    from: {
        type: ObjectId,
        ref: 'User'
    },
    reply: [  // 用户互评  因为不止一条，所以是数组
        {
            from: {
                type: ObjectId,
                ref: 'User'
            },
            to: {
                type: ObjectId,
                ref: 'User'
            },
            content: String
        }],
    content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        },
    }
})
// 添加一个方法来
CommentSchema.pre('save', function (next) {
    if (this.inNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

CommentSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    // cb == callback 回调
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}
module.exports = CommentSchema