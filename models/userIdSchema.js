// 用来维护用户 id 自增长的表

const mongoose = require('mongoose');

const userIdSchema = mongoose.Schema({
  _id: String, //用户ID，自增长
  sequence_value: Number,
});

// 模型名称 ， schema，数据库
module.exports = mongoose.model('userId', userIdSchema, 'userIds');
